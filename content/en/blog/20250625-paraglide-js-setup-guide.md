---
title: "Paraglide.js Setup: Type-Safe i18n Without Framework Lock-in"
topic: "i18n"
description: Complete setup guide for Paraglide.js 2.0 with Vite plugin. Framework-agnostic i18n with zero runtime overhead, full TypeScript support, and automatic builds.
hero:
  image: $assets/paraglide-setup.jpg
  alt: Paraglide.js setup guide
  photographer: "@Tomas Sobek"
  photographer_link: https://unsplash.com/@tomas_nz
meta:
  keywords:
    - paraglide.js
    - paraglide setup
    - framework agnostic i18n
    - vite plugin
    - type safe internationalization
    - zero runtime i18n
    - compile time translations
    - javascript i18n
    - typescript i18n
    - i18n setup guide
published: 2025-06-25
layout: $layout/BlogPost.svelte
category: dev
tags:
  - JavaScript
  - TypeScript
  - i18n
  - Vite
  - Setup Guide
  - Developer Experience
  - blog
---

# Paraglide.js Setup: Type-Safe i18n Without Framework Lock-in

Most i18n solutions work across frameworks, but they come with tradeoffs. Runtime overhead, complex configuration, or weak TypeScript integration. You get flexibility, but you sacrifice performance or developer experience.

Paraglide.js is different. Compile-time translation generation means zero runtime overhead, full type safety, and a dead-simple API. No complex configuration, no runtime bundle bloat, no guessing which translation keys exist.

Version 2.0 introduced a framework-agnostic Vite plugin that automatically triggers builds when translations change, eliminating the manual compilation step required in v1.

I use Paraglide in production on [dropanote.de](https://dropanote.de), built with my own site builder. Here's why it works better than the alternatives, and how to set it up.

## Core Setup

Start with the init command:

```bash
npx @inlang/paraglide-js@latest init
```

This creates your project configuration and translation file structure. Then add the Vite plugin to your `vite.config.ts`:

```ts
import { paraglideVitePlugin } from "@inlang/paraglide-js/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
    }),
  ],
});
```

## Translation Files

The init command creates a `messages/` directory with your translation files. Each locale gets its own JSON file:

```
messages/
├── en.json
└── de.json
```

Your English translations in `messages/en.json`:

```json
{
  "hello": "Hello",
  "welcome": "Welcome to our site",
  "nav_home": "Home",
  "nav_about": "About"
}
```

German translations in `messages/de.json`:

```json
{
  "hello": "Hallo",
  "welcome": "Willkommen auf unserer Website",
  "nav_home": "Startseite",
  "nav_about": "Über uns"
}
```

When you build your project, Paraglide generates TypeScript functions for each translation key.

## Basic Usage

Start your dev server and the Vite plugin will automatically generate your translation functions:

```bash
npm run dev
```

Then import the generated message functions:

```ts
import * as m from "./src/lib/paraglide/messages";
```

Use your translations with full type safety:

```ts
// Simple messages
m.hello(); // "Hello" or "Hallo"
m.welcome(); // "Welcome to our site" or "Willkommen auf unserer Website"

// Nested keys
m.nav_home(); // "Home" or "Startseite"
m.nav_about(); // "About" or "Über uns"
```

For language switching, import the locale functions:

```ts
import { setLocale, getLocale } from "./src/lib/paraglide/runtime";
```

Switch languages programmatically:

```ts
setLocale("de");
console.log(m.hello()); // "Hallo"

setLocale("en");
console.log(m.hello()); // "Hello"

// Check current locale
console.log(getLocale()); // "en"
```

Your editor provides autocomplete for all translation keys, and TypeScript catches typos at compile time.

## Parameters in Translations

Your translations can accept dynamic values using curly brace placeholders:

**In your translation files:**

```json
{
  "greeting": "Hello {name}!",
  "item_count": "You have {count} items in your cart",
  "user_profile": "Welcome back, {first_name} {last_name}"
}
```

**In your code:**

```ts
import * as m from "./src/lib/paraglide/messages";

m.greeting({ name: "Alice" }); // "Hello Alice!"
m.item_count({ count: 5 }); // "You have 5 items in your cart"
m.user_profile({
  first_name: "John",
  last_name: "Doe",
}); // "Welcome back, John Doe"
```

TypeScript enforces the required parameters - you'll get compile errors if you forget them or use the wrong names.

## Framework Integration

The beauty of Paraglide is that it works identically across frameworks. The same import, the same functions, the same API:

```ts
import * as m from "./src/lib/paraglide/messages";
import { setLocale } from "./src/lib/paraglide/runtime";
```

**In vanilla JavaScript:**

```js
import * as m from "./src/lib/paraglide/messages";
import { setLocale } from "./src/lib/paraglide/runtime";

document.getElementById("title").textContent = m.welcome();

// Language switching
document.getElementById("lang-de").addEventListener("click", () => {
  setLocale("de");
  updateUI();
});

function updateUI() {
  document.getElementById("title").textContent = m.welcome();
  document.getElementById("nav-home").textContent = m.nav_home();
}
```

**In React:**

```jsx
function Welcome() {
  return <h1>{m.welcome()}</h1>;
}
```

**In Vue:**

```vue
<template>
  <h1>{{ m.welcome() }}</h1>
</template>
```

**In Svelte:**

```svelte
<h1>{m.welcome()}</h1>
```

No framework-specific wrappers, no different APIs to learn. The same translation functions work everywhere because they're just JavaScript functions.

## Advanced Configuration Options

### Language Detection Strategy

Configure how Paraglide determines the user's language:

```ts
paraglideVitePlugin({
  project: "./project.inlang",
  outdir: "./src/lib/paraglide",
  strategy: [
    "url",
    "cookie",
    "header",
    "localStorage",
    "sessionStorage",
    "baseLocale",
  ],
});
```

Available strategies:

- `url` - checks the URL path (`/de/about`)
- `cookie` - checks for a language cookie
- `header` - checks Accept-Language header (SSR)
- `localStorage` - checks browser local storage
- `sessionStorage` - checks browser session storage
- `baseLocale` - falls back to your default language

Paraglide tries these strategies in order until it finds a valid locale. If none match, it uses your `baseLocale`.

### Custom Output Directory

Change where generated files are placed:

```ts
paraglideVitePlugin({
  project: "./project.inlang",
  outdir: "./src/i18n", // Custom location
});
```

Then import from your custom path:

```ts
import * as m from "./src/i18n/messages";
```

## Conclusion

Bundle size matters. Every kilobyte of JavaScript affects your page load times, especially on mobile devices.

Traditional i18n libraries ship their entire runtime to the browser - parsers, formatters, and configuration logic. Paraglide compiles everything at build time, so your users only download the actual translated strings as simple JavaScript functions.

This was the main reason I switched to Paraglide for my frontend-rendered sites. When every byte counts for performance, zero-runtime overhead makes a real difference.

Server-side rendering? The bundle size advantage matters less. But for client-side apps, SPAs, and any frontend-heavy project, Paraglide's compile-time approach delivers measurable performance benefits.

The type safety and framework flexibility are nice bonuses. The smaller bundles are why it's worth the switch.
