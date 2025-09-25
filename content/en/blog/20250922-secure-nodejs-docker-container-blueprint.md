---
title: "Secure Production-Ready Node.js Docker Container – Blueprint"
description: "Complete Node.js Docker blueprint for production containers. Remove dev dependencies, reduce image size, and increase security with multi-stage builds. Ready-to-use Dockerfile included."
hero:
  image: $assets/container-ship-01.jpg
  photographer: "Ian Taylor"
  photographer_link: https://unsplash.com/@carrier_lost
meta:
  keywords:
    - nodejs docker
    - docker container
    - production container
    - node.js production
    - docker security
    - container optimization
    - multi-stage docker
    - nodejs deployment
    - docker best practices
    - production deployment
published: 2025-09-22
layout: $layout/BlogPost.svelte
ref: /de/blog/20250922-sichere-nodejs-docker-container-blaupause/
category: dev
tags:
  - Node.js
  - Docker
  - Production
  - Container
  - Security
  - Developer Experience
  - blog
---

# Secure Production-Ready Node.js Docker Container – Blueprint

Many teams use the same Dockerfile for development and production, but this creates unnecessary risks. Development containers prioritize flexibility and debugging tools, while **production Node.js containers** need minimal attack surface and fast deployments.

The easiest way to **increase security and reduce container size** is removing development dependencies. NPM packages are the most overlooked attack vector in Node.js containers.

This blueprint shows how to **build optimized production containers** that exclude development dependencies entirely, reducing both **Docker image size** and security exposure.

## Production-Ready Node.js Dockerfile Blueprint

This **Node.js production Docker** blueprint assumes your project uses build tools (Vite, Rollup, TypeScript, etc.) to compile code. Build tools are, alongside removing development dependencies, another simple step to reduce unnecessary code.

```dockerfile title="Complete Dockerfile"
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

By splitting into multiple stages, we achieve better caching, which leads to faster builds.

### Docker Base Image Configuration

The base stage isn't strictly needed for this example, but it's useful when you need to install system packages or want to easily change Node.js versions across all stages.

```dockerfile
FROM node:lts AS base
WORKDIR /usr/src/app
```

### Optimize Node.js Dependencies Caching

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

This stage serves mainly for caching. The installations could otherwise be done in the other stages.

Important: We do two installations here. One for build, one for production. As long as `package.json` or `package-lock.json` don't change, this stage will be loaded from cache.

### Build Stage for Node.js Applications

This is where it gets important: In this step, the application is built. This allows us to more easily abstract the build process result and the modules needed for it.

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

For building, we get the dev dependencies from the install stage and import all project files (except those excluded by `.dockerignore`) for the build.

### Final Production Container Setup

Final step: Only what's necessary for runtime is taken from the other steps.

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

In the previous steps, all steps run as the `root` user – this avoids permission conflicts during building. In production, we switch to a user without root privileges. This increases security because the executing user has fewer rights in the system.

## Force Docker Rebuild Without Cache

Docker loads individual stages from cache as long as none of the imported files show changes. This means no code in the stage gets executed. This is not always desired and can be bypassed with the `--no-cache` flag.

To run everything from scratch, use the `--no-cache` flag when building:

```sh
docker build --no-cache -t my-nodejs-container .
```

## Fixing Docker Volume Permission Issues with Node User

In the final step, the user was switched to `node` for better security. This restricts the user and may possibly lead to problems when accessing mounts from the host system.

For access to succeed, the files on the host system must be assigned to the same user ID (`uid`). This can be done when starting the container or on the host system.

When starting the container, a startup script must be integrated that takes over this task, because only the final `ENTRYPOINT` command is still executed at startup.
