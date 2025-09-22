---
title: "Sichere produktionsreife Node.js Docker Container – Blaupause"
description: "Vollständige Node.js Docker Blaupause für Produktionscontainer. Dev-Dependencies entfernen, Image-Größe reduzieren und Sicherheit erhöhen mit Multi-Stage-Builds."
ref: /en/blog/20250922-secure-nodejs-docker-container-blueprint/
hero:
  image: $assets/container-ship-01.jpg
  photographer: "Ian Taylor"
  photographer_link: https://unsplash.com/@carrier_lost
meta:
  keywords:
    - nodejs docker
    - docker container
    - produktionscontainer
    - node.js produktion
    - docker sicherheit
    - container optimierung
    - multi-stage docker
    - nodejs deployment
published: 2025-09-22
layout: $layout/BlogPost.svelte
category: dev
tags:
  - Node.js
  - Docker
  - Produktion
  - Container
  - Sicherheit
  - blog
---

# Sichere produktionsreife Node.js Docker Container – Blaupause

Viele Teams nutzen das gleiche Dockerfile für Entwicklung und Produktion. Das funktioniert, schafft aber unnötige Risiken. Entwicklungscontainer brauchen Flexibilität und Debug-Tools, **Produktionscontainer** dagegen minimale Angriffsfläche und schnelle Deployments.

Der einfachste Weg, **Sicherheit zu erhöhen und Container verkleinern**: Entwicklungsabhängigkeiten entfernen. NPM-Pakete sind der meist übersehene Schwachpunkt in Node.js-Containern.

Diese Blaupause zeigt, wie du **Produktionscontainer baust**, die Entwicklungsabhängigkeiten komplett ausschließen – **kleinere Images** und weniger Sicherheitsrisiken.

## Produktionsreife Node.js Dockerfile Blaupause

In diesem Dockerfile gehen wir davon aus, dass das Projekt mithilfe eines Build-Tools (Vite, Rollup, TypeScript, etc.) übersetzt wird. Build-Tools sind neben dem Weglassen von Entwicklungsabhängigkeiten ein weiterer einfacher Schritt, unnötigen Code zu reduzieren.

```dockerfile
FROM node:lts AS base
WORKDIR /usr/src/app

## Cache dependencies to speed up future build
FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json package-lock.json /temp/dev/
RUN cd /temp/dev && npm ci

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json package-lock.json /temp/prod/
RUN cd /temp/prod && npm ci --production

## Build your Application
FROM base AS build

# Copy node_modules from temp directory
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional]  build
ENV NODE_ENV=production
RUN npm run build

# Copy production dependencies and source code into final image
FROM base AS release

USER node
# Get only production dependencies
COPY --from=install /temp/prod/node_modules node_modules
# Change to your build output
COPY --from=build /usr/src/app/build .
COPY --from=build /usr/src/app/package.json .

ENV PORT=3000
EXPOSE 3000/tcp

ENTRYPOINT ["node", "./index.js"]
```

Durch eine Aufteilung in mehrere Stages erreichen wir ein besseres Caching, was zu schnelleren Builds führt.

### Docker Base Image Konfiguration

Die Base-Stage ist nicht zwingend nötig, aber praktisch. Du kannst einfach Node.js-Versionen ändern oder System-Pakete installieren – alles an einer Stelle.

```dockerfile
FROM node:lts AS base
WORKDIR /usr/src/app
```

### Node.js Dependencies Caching optimieren

```dockerfile
## Cache dependencies to speed up future build
FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json package-lock.json /temp/dev/
RUN cd /temp/dev && npm ci

# Install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json package-lock.json /temp/prod/
RUN cd /temp/prod && npm ci --production
```

Diese Stage dient hauptsächlich dem Caching. Die Installationen könnten ansonsten auch in den anderen Stages vorgenommen werden.

Wichtig: Wir machen zwei Installationen. Eine für Build, eine für Produktion. Solange sich `package.json` oder `package-lock.json` nicht ändern, kommt diese Stage aus dem Cache.

### Build Stage für Node.js Anwendungen

Ab hier wird es wichtig: In diesem Schritt wird die Anwendung gebaut. Dadurch können wir das Ergebnis des Build-Prozesses und die dafür benötigten Module einfacher abstrahieren.

```dockerfile
## Build your Application
FROM base AS build

# Copy node_modules from temp directory
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional]  build
ENV NODE_ENV=production
RUN npm run build
```

Zum Bauen holen wir die Dev-Dependencies aus der Install-Stage und importieren alle Projektdateien (außer denen in `.dockerignore`) für den Build.

### Finales Produktionscontainer Setup

Letzter Schritt: Nur das für die Laufzeit Notwendige wird aus den anderen Schritten übernommen.

```dockerfile
# Copy production dependencies and source code into final image
FROM base AS release

USER node
# Get only production dependencies
COPY --from=install /temp/prod/node_modules node_modules
# Change to your build output
COPY --from=build /usr/src/app/build .
COPY --from=build /usr/src/app/package.json .

ENV PORT=3000
EXPOSE 3000/tcp

ENTRYPOINT ["node", "./index.js"]
```

In den Schritten davor laufen alle Schritte als `root` User – das vermeidet Berechtigungsprobleme beim Bauen. In Produktion wechseln wir zu einem User ohne Root-Rechte. Das erhöht die Sicherheit, dadurch dass der ausführende User weniger Rechte im System hat.

## Docker Rebuild ohne Cache erzwingen

Docker lädt einzelne Stages aus dem Cache, solange keine der importierten Dateien Änderungen aufweisen. Das bedeutet, dass kein Code in der Stage ausgeführt wird. Das ist nicht immer erwünscht und kann durch das `--no-cache` Flag umgangen werden.

```sh
docker build --no-cache -t my-nodejs-container .
```

## Docker Volume Berechtigungsprobleme mit Node User beheben

Im letzten Schritt wurde der User für bessere Sicherheit auf `node` gewechselt.
Dies schränkt den Nutzer ein und kann möglicherweise zu Problemen beim Zugriff auf Mounts des Host-Systems führen.

Damit der Zugriff gelingt, müssen die Dateien des Host-Systems der gleichen User-ID (`uid`) zugeordnet sein. Das kann beim Start des Containers erfolgen oder auf dem Host-System.

Beim Start des Containers muss ein Startscript eingebunden werden, das diese Aufgabe übernimmt, denn nur der letzte Befehl `ENTRYPOINT` wird beim Start noch ausgeführt.
