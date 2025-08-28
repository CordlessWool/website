---
title: "Reliable Puppeteer Container Setup for PDF Generation"
description: "Official Puppeteer containers have rendering issues that break PDF layouts. Here's a working Docker setup with Chromium that gives consistent results for production PDF generation."
ref: /de/blog/20250829-zuverlaessige-puppeteer-container-konfiguration-pdf-generierung
hero:
  image: $assets/container-front.jpg
  alt: symbol picture for docker container
  photographer: "@anniespratt"
  photographer_link: https://unsplash.com/@anniespratt
meta:
  keywords:
    - puppeteer docker container
    - puppeteer spacing issues
    - docker pdf generation
    - puppeteer chromium container
    - reliable puppeteer setup
    - puppeteer container problems
    - pdf generation docker
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

# Reliable Puppeteer Container Setup for PDF Generation

When developing [PDF generation for a warehouse management system](/en/blog/20250805-dynamic-pdf-generation-puppeteer/), I tried using the official Puppeteer container to reduce configuration complexity. I had developed everything locally first, and it worked perfectly.

But when I deployed with the container, all spacing disappeared - margins, padding, everything was compressed. The PDF generation logic still worked, but the layout was completely broken.

## Puppeteer Container Spacing Issues

![Puppeteer PDF output compare from differnt Dockerfile]($assets/puppeteer-pdf-compare-without-spacing.png)

I tried different Puppeteer configurations and researched the problem extensively. After multiple research sessions, AI conversations, and attempts with various configurations, nothing fixed the spacing issues.

Initially, it wasn't clear whether this was a general container problem or something specific to the official Puppeteer container. The simplest way to evaluate this was building my own container with Chromium installed. Most web tutorials were unnecessarily complex, and it turned out that a simple Chromium installation with proper Puppeteer configuration is completely sufficient.

When I tested this approach, the spacing issues disappeared completely, confirming it was specifically a problem with the official Puppeteer container.

## My Working Solution

Here's my working Dockerfile that solves the spacing issues. The main part is in the first few lines - the rest is just standard Node.js setup:

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

When Puppeteer starts, it won't find its bundled Chrome version, so you need to tell it which browser to use. If you're using different environments with different Chrome installations, you can set this via environment variables. For local installations, setting the `executablePath` is not necessary.

The key configuration change in your Puppeteer code:

```javascript
const browser = await puppeteer.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
```

Note: `--no-sandbox` reduces security when processing untrusted content. For internal applications like warehouse systems, this trade-off is usually acceptable.

## Updating Chromium Version

Keep in mind that Docker will use the cache for builds, so Chromium probably won't be updated with each build. This is fine for development because you save build time, but for production you'll want the current version:

```bash
docker build -t your-image-name --no-cache .
```
