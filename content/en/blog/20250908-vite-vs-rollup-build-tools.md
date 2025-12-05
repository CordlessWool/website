---
title: "Vite vs Rollup: When to Use Which Build Tool"
description: "Vite uses Rollup for production builds but excels at web app development with HMR. For libraries, Rollup or tsup are better choices. Understand the relationship and pick the right tool."
topic: Build Tools
ref: /de/blog/20250908-vite-vs-rollup-welche-build-tool/
hero:
  image: $assets/zebra-wiht-two-heads.jpg
  photographer: "@jackcharles"
  photographer_link: https://unsplash.com/@jackcharles
meta:
  keywords:
    - vite vs rollup
    - build tools comparison
    - when to use vite
    - when to use rollup
    - javascript bundler
    - development workflow
    - web application bundling
    - library development
    - esbuild vs rollup
    - frontend tooling
published: 2025-09-08
layout: $layout/BlogPost.svelte
category: dev
tags:
  - JavaScript
  - Build Tools
  - Vite
  - Rollup
  - Developer Experience
  - Frontend Tooling
  - blog
---

# Vite vs Rollup: When to Use Which Build Tool

Webpack dominated application bundling for years, while Rollup found its niche in library and application development. Vite changed the game by combining Rollup's clean production builds with lightning-fast development.

## Why Vite Took Over

Vite uses Rollup for production builds but completely changes the development workflow. Instead of rebuilding your entire project on every file change like traditional setups, Vite serves modules directly to the browser using native ES modules and only transforms what's actually requested.

## Why Vite is So Much Faster in Development

During development, Vite uses esbuild to transform individual files blazingly fast, serving them on-demand rather than bundling the entire project upfront. For production builds, Vite switches to Rollup for better optimization and code splitting.

This creates a plugin compatibility challenge: Vite implements partial Rollup plugin support. Core hooks like `resolve`, `load`, and `transform` were adapted by Vite from Rollup's plugin system to work in both development and production, but build-specific hooks like `buildStart` and `buildEnd` only work during production builds. This and other factors limit some plugins but cover the most common use cases.

[CONTINUE FROM HERE - NEXT SECTIONS TO CLEAN UP]

## When to Use Vite? When to Use Rollup?

As explained, Vite is much faster in the development phase. So why not use Vite all the time?

Vite has a clear focus on web applications. Features like Hot Module Reloading (HMR) make sense when you have an application that needs browser refresh. For building libraries and server APIs, there's no browser interface – the best way to interact with your code is through tests, not live reloading. That's still the domain of Rollup or other libraries like tsup.

### Switching Between Vite and Rollup

Switching between the two tools is generally possible, but not guaranteed to be seamless. Most Rollup plugins use only basic functionality that Vite supports, making the transition from Rollup to Vite relatively straightforward in most cases.

The reverse direction—using Vite plugins in Rollup—works much more smoothly, though you'll lose Vite-specific features like Hot Module Reloading and development server capabilities. Since Vite 100% relies on Rollup for production builds, the build-time functionality will work identically. Only in watch mode could there be limitations – for watch mode, this must be checked individually in case of doubt. Due to the similarities, there are many libraries that cover exactly the same area and are built similarly.

However, there are edge cases to consider. Some advanced plugin features, like Rollup's `this.emitFile()` for including new files in the build process, do not have equivalent implementations in Vite's development mode. These compatibility gaps are rare but can create unexpected issues when migrating complex setups and trying to use plugins from each other.

### Interesting to Know: Even Svelte Switched to Vite

Even though Rich Harris is the father of both Rollup and Svelte, Svelte switched to Vite for better development performance. On build there is still the full power of Rollup, while the development experience increased heavily.

## Conclusion

For most developers building web applications, Vite is the clear choice. It offers the development speed modern teams need while leveraging Rollup's proven production capabilities. Rollup remains excellent for libraries and specialized use cases, but for the majority of projects, it's become the powerful engine behind Vite rather than a daily tool.
