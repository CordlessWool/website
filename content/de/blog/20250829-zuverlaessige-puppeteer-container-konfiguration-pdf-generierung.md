---
title: "Zuverlässige Puppeteer-Container-Konfiguration für PDF-Generierung"
description: "Offizielle Puppeteer-Container haben Rendering-Probleme, die PDF-Layouts zerstören. Hier ist ein funktionierendes Docker-Setup mit Chromium für konsistente Ergebnisse in der Produktion."
ref: /en/blog/20250829-reliable-puppeteer-container-setup-pdf-generation/
hero:
  image: $assets/container-front.jpg
  alt: Symbolbild für Docker Container
  photographer: "@anniespratt"
  photographer_link: https://unsplash.com/@anniespratt
meta:
  keywords:
    - puppeteer docker container
    - puppeteer spacing probleme
    - docker pdf generierung
    - puppeteer chromium container
    - zuverlässige puppeteer konfiguration
    - puppeteer container probleme
    - pdf generierung docker
    - chromium puppeteer
published: 2025-08-29
layout: $layout/BlogPost.svelte
category: dev
tags:
  - Docker
  - Puppeteer
  - PDF Generation
  - Container
  - Chrome
  - blog
---

# Zuverlässige Puppeteer-Container-Konfiguration für PDF-Generierung

Bei der Entwicklung eines Services zur [PDF-Generierung als Teil einer Lagerverwaltung](/de/blog/20250805-dynamische-pdf-generierung-puppeteer) sollte der offizielle Puppeteer-Container die Dockerfile-Konfiguration vereinfachen. Da das System neu entwickelt wurde, fand die Entwicklung zunächst lokal statt.

Bei der Migration in den Container zeigte sich jedoch ein Rendering-Problem: Der Puppeteer-Container rendert anders als die lokale Version. Definierte Abstände wurden ignoriert und das PDF schrumpfte zu einem unübersichtlichen Block. Die Implementierungslogik funktionierte weiterhin, aber das Layout war fehlerhaft und unleserlich.

## Puppeteer-Container-Rendering-Probleme

![Puppeteer PDF vergleich von zwei unterschiedlcihen Dockerfiles]($assets/puppeteer-pdf-compare-without-spacing.png "Vergleich mit offizieller Puppeteer (rechts)")

Nach mehreren Recherchen, AI-Konversationen und Versuchen mit verschiedenen Konfigurationen ließ sich das Problem nicht beheben.

Unklar war zunächst, ob das Problem containerbedingt ist oder spezifisch mit dem Puppeteer-Container zusammenhängt. Die einfachste Evaluationsmöglichkeit stellte ein eigener Docker-Container dar. Die meisten Web-Anleitungen waren unnötig komplex - eine einfache Chromium-Installation mit entsprechender Puppeteer-Konfiguration reicht völlig aus.

## NodeJS + Chromium Lösung

Das folgende Dockerfile installiert Chromium für Puppeteer im Base Image. Der Rest behandelt das Standard Node.js/npm Setup, wichtig sind zusätzlich die Puppeteer-Launch-Anpassungen:

```dockerfile
# Use the official Node.js LTS image
FROM node:lts AS base
WORKDIR /usr/src/app

# Install Chromium manually
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Multi-stage build for dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json package-lock.json /temp/dev/
RUN cd /temp/dev && npm ci

RUN mkdir -p /temp/prod
COPY package.json package-lock.json /temp/prod/
RUN cd /temp/prod && npm ci --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM base AS release
# Skip Puppeteer's bundled Chromium since we installed our own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/build .
COPY --from=prerelease /usr/src/app/package.json .

ENV PORT=3733
EXPOSE 3733/tcp
USER node
ENTRYPOINT ["node", "./index.js"]
```

Damit Puppeteer sich nicht über eine fehlende Chrome-Installation beschwert, muss der Pfad zur Installation konfiguriert werden. Bei verschiedenen Umgebungen mit unterschiedlichen Chrome-Installationen kann dies über Umgebungsvariablen erfolgen. Für lokale Installationen ist das Setzen des `executablePath` nicht notwendig.

Konfigurationsänderung im Puppeteer-Code:

```javascript
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
```

Hinweis: `--no-sandbox` reduziert die Sicherheit bei der Verarbeitung von nicht vertrauenswürdigem Inhalt. Für interne Anwendungen wie Lagersysteme ist dieser Kompromiss normalerweise akzeptabel.

## Chromium-Version aktualisieren

Docker verwendet beim Build den Cache, wodurch Chromium wahrscheinlich nicht zur Laufzeit aktualisiert wird. Für die Entwicklung ist das vorteilhaft, da Build-Zeit gespart wird. Für Production-Deployments sollte jedoch die aktuelle Version verwendet werden:

```bash
docker build -t your-image-name --no-cache .
```
