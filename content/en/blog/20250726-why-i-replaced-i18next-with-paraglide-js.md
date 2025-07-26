---
title: "Why I Replaced i18next with Paraglide.js"
description: "40KB just to handle translations? I discovered Paraglide.js reduces this to 2KB while enabling tree shaking and build-time optimization. Here's why I made the switch."
hero:
  image: $assets/paraglide-switch-i18n.jpg
  alt: Person paragliding - representing the switch to Paraglide.js
  photographer: "Renato"
  photographer_link: https://unsplash.com/@cvzzn
meta:
  keywords:
    - i18next vs paraglide
    - paraglide.js migration
    - i18next bundle size
    - build-time i18n
    - tree shaking translations
    - i18n bundle optimization
    - frontend performance
    - javascript i18n
    - i18next alternative
    - paraglide js
published: 2025-07-26
layout: $layout2/blogPost
ref: /de/blog/20250726-warum-ich-i18next-durch-paraglide-js-ersetzt-habe/
category: dev
tags:
  - JavaScript
  - Performance
  - i18n
  - Bundle Optimization
  - Migration
  - blog
---

# Why I Replaced i18next with Paraglide.js

Often your first choice is not your best one. Investing hours in comparing tools and reading documentation can be annoying, and most i18n libraries look pretty similar anyway. So my decision fell quickly to the popular choice: i18next.

But as always, I kept my eyes open and discovered Paraglide.js - which approaches i18n very differently from other tools.

The JavaScript world is evolving toward smarter bundling - away from shipping unused code toward build-time optimization. While websites keep getting bigger and more complex, the tooling has gotten more precise about what actually reaches users.

Here's why I made the switch.

## Move from Runtime to Build Time

i18next follows the traditional i18n approach: handle everything at runtime. Every time a user loads your page, it:

- Loads translation files from the server
- Parses JSON structures
- Handles key lookups and interpolation
- Processes pluralization rules

This works fine and has been the standard for years. But modern build tools opened up a different possibility.

Paraglide.js shifts most of the work to build time. During compilation, it generates individual JavaScript functions for each translation key.

```typescript
// i18next: runtime processing
t("welcome_user", { name: "John" });

// Paraglide.js: pre-generated function call
welcome_user({ name: "John" });
```

Both systems still check the current locale at runtime - users can switch languages. But while i18next also parses translation keys and handles interpolation with every call, Paraglide.js pre-compiles this work into ready-to-use functions.

If you're using a build tool like Vite, this happens automatically. Your users download the final functions instead of translation processing logic.

## Reducing Bundle Size by Over 40KB

40KB might not sound significant - "websites weigh over 1MB nowadays anyway," you might think. But every KB affects Core Web Vitals and mobile performance. Modern build tools have become precise about eliminating unnecessary overhead for good reason.

40KB just to handle translations. That's enough space for thousands of actual translated strings - probably your entire app's content in multiple languages. Paraglide.js reduces this to ~2KB.

The difference comes down to philosophy: ship results, not processing engines.

Migration is mostly find-and-replace work:

```regex
Find: t\(['"`]([^'"`]+)['"`](?:,\s*(\{[^}]+\}))?\)
Replace: $1($2)
```

Converts both:

- `t('welcome_message')` → `welcome_message()`
- `t('welcome_user', { name: 'John' })` → `welcome_user({ name: 'John' })`

## Don't Care About Translation File Size - Just Shake the Tree

Here's the best part: forget about worrying if your translation files get too big or whether you need to reduce them for load speed - it happens automatically.

**Before (i18next):**

```typescript
// All translations ship to users
{
  "welcome_message": "Welcome!",
  "admin_panel_title": "Admin Dashboard",
  "debug_info": "Debug mode active",
  "unused_feature": "Feature not implemented",
  // ... 200+ more translations
}
```

**After (Paraglide.js):**

```typescript
// Only import what you actually use
import { welcome_message } from "./messages";
// admin_panel_title, debug_info, unused_feature automatically eliminated
```

With i18next, users download all translations whether they're used or not. With Paraglide.js, the logic is no longer hidden from build tools - they can finally do what they're designed for: optimizing your code. Your translation files stay complete, but users only get what your code actually imports.

Bonus: you can reuse comprehensive translation files between projects without worrying about bloat. Keep everything, ship only what's needed.

## TypeScript Support as a Bonus

Since Paraglide.js generates TypeScript-compatible code, you get native TypeScript support automatically when you import them directly. Real autocomplete, real parameter checking, real compile-time errors - no type generation needed.

```typescript
import { welcome_user, item_count } from "./messages";

welcome_user({ name: "John" }); // Autocomplete suggests 'name' parameter
item_count({ count: "5" }); // TypeScript error: 'count' should be number
```

TypeScript can be slow picking up new translations, which becomes noticeable when adding many translations quickly.

## Why I Prefer Build Time Over Runtime

This comes down to a fundamental principle of software development: do things once, reuse the result. Why process the same translations the same way hundreds, thousands, or millions of times when you could do it once?

With i18next, every user on every page load processes translations identically. With Paraglide.js, this work happens once during build - then gets reused by every user forever.

Even though computing power is cheap nowadays, this philosophy still improves user experience. Why make users' devices do work that could have been done on your build server? Why ship processing logic when you could ship the result?

It's not just about performance - it's about doing things right. Build-time optimization follows the core principle: write once, run everywhere.
