---
title: "Your SvelteKit Bun Project Still Runs on Node.js"
description: "Why SvelteKit with Bun often still runs on Node.js - adapter issues, CORS errors, and how to safely switch between adapters."
slug: "20250831-sveltekit-bun-project-still-runs-on-nodejs"
ref: "/de/blog/20250831-sveltekit-bun-projekt-laeuft-weiterhin-auf-nodejs/"
hero:
  image: $assets/puzzle-white.jpg
  photographer: "@photography_cb_"
  photographer_link: https://unsplash.com/photography_cb_
meta:
  keywords:
    - SvelteKit Bun adapter
    - svelte-adapter-bun
    - SvelteKit Node.js
    - Bun runtime
    - SvelteKit adapter system
    - CORS issues SvelteKit
    - Origin header SvelteKit
    - Bun vs Node.js
    - SvelteKit production
    - adapter-auto
published: 2025-08-31
layout: $layout/BlogPost.svelte
category: dev
tags:
  - SvelteKit
  - Bun
  - Node.js
  - Adapter
  - Runtime
  - CORS
  - Developer Experience
  - blog
---

# Your SvelteKit Bun Project Still Runs on Node.js

Bun is installed, SvelteKit project set up with `bunx sv create my-app`, dev server running `bun run dev` and everything works perfectly. The performance boost can begin... but wait: Your code is still running on the Node.js engine.

While Bun is more than just a runtime engine, often Node.js still runs in the background. This is confusing but ensures that software and frameworks continue to work. Only when a Bun server is actually started (`Bun.serve()`) or the Bun engine is explicitly forced (`--bun`) does Bun actually start.

## The SvelteKit Adapter System

To run SvelteKit with Bun, you need an appropriate adapter. SvelteKit's default adapter `@sveltejs/adapter-auto` is essentially a wrapper that automatically detects common platforms and selects the right platform - however, none of them are based on Bun.

```javascript
// svelte.config.js - Default setup
import adapter from "@sveltejs/adapter-auto";

export default {
  kit: {
    adapter: adapter(), // Detects platform automatically
  },
};
```

To ensure the right adapter is executed, you should set the adapter explicitly when defining your platform. In connection with a backend, this would be the Node adapter in most cases: `@sveltejs/adapter-node`.

For several years now, Node.js has not stood alone as a popular JavaScript engine. Therefore, there are also SvelteKit adapters for other systems like `svelte-adapter-deno` or `svelte-adapter-bun`. Both projects are community projects and are not maintained by the Svelte/SvelteKit team.

```javascript
// Production server options
import adapter from "@sveltejs/adapter-node"; // ← Most commonly used
// import adapter from 'svelte-adapter-deno';     // ← Community maintained
// import adapter from 'svelte-adapter-bun';      // ← Community maintained

export default {
  kit: {
    adapter: adapter(),
  },
};
```

The SvelteKit Adapter System allows you to optimally adapt the runtime environment to your system and needs. Unfortunately, the documentation is very minimal compared to the rest of the Svelte/SvelteKit documentation.

This makes adaptations to existing adapters more difficult and time-consuming, especially when experience in this area is lacking. The `svelte-adapter-bun` is based on an old version of the official `@sveltejs/adapter-node` but has never sufficiently adopted its later adaptations. Its development has come to a standstill in recent years.

Even though the changes in the adapter system were minimal in relation to other developments, they already cause limitations in usage.

## Why the Bun Adapter Only Fails in Production

In development, SvelteKit uses the Vite dev server - the chosen adapter doesn't matter. Also, `localhost` is exempt from CORS protection. Only with a real deployment using an external URL do the security mechanisms become active.

SvelteKit has automatically blocked form routes against external access since recent updates. For this to work, the Origin header must be set correctly or the environment variable `ORIGIN` must be defined. Disabling these protections is possible but not advisable.

This is exactly where the Bun adapter fails: Although the ORIGIN address can theoretically be set, it is not correctly passed to SvelteKit. Form actions fail because the Origin header is missing or incorrectly transmitted.

## How to Switch Between SvelteKit Adapters

Fortunately, it's a molehill and not a mountain, because the SvelteKit Adapter System doesn't bind you to one environment.

When the Bun adapter fails, switching back to `adapter-node` is usually a single configuration change:

```diff
// svelte.config.js
- import adapter from 'svelte-adapter-bun';
+ import adapter from '@sveltejs/adapter-node';
```

> I've already looked at the adapter system and put some thought into updating the Bun adapter, but my need relative to my time is too low. However, I'm happy to participate in development.

## Why Development Mode Uses Vite Instead of Your SvelteKit Adapter

As is well known, SvelteKit builds on Vite. Until the application is built, everything runs in Vite, only then do the SvelteKit adapters really come into play.

### Why Vite Has Its Own Development Server

The short version: Vite handles file change reloading granularly so that not everything needs to be rebuilt. This is one of Vite's main features. Through control over the dev server, Vite can render individual fragments of a route without rebuilding the entire application like Rollup does.

### Using Vite with Bun

To use Bun as a runtime during development, the `--bun` flag must be set:

```bash
bun --bun run dev  # Uses Bun runtime
bun run dev        # Uses Node.js runtime
```

But even without the Bun runtime, you can use Bun's package manager, workspace handling, and faster task execution. However, Bun-specific libraries like `bun:sqlite` require the `--bun` flag.

## Conclusion: Start Simple, Upgrade Later

Without forms, the Bun adapter will probably work well. Either way, a later switch through the SvelteKit Adapter System is easily possible. This also applies to other adapters - like migrating to function-based systems like Cloudflare Functions or Pages.
