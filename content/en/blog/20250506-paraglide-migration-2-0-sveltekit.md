---
title: "Paraglide 2.0 Migration – From Framework Glue to Clean Abstraction"
description: A hands-on guide for upgrading to Paraglide.js 2.0 with real-world examples, gotchas, and improved i18n architecture.
hero:
  image: $assets/paraglide-migration.jpg
  alt: Paraglide
  photographer: "@Vincentiu Solomon"
  photographer_link: https://unsplash.com/@vincentiu
meta:
  keywords:
    - paraglide
    - paraglidejs
    - paraglide.js
    - inlang
    - i18n
    - internationalization
    - vite plugin
    - sveltekit
    - migration guide
    - developer experience
published: 2025-05-06
layout: $layout2/blogPost
category: dev
tags:
  - JavaScript
  - Migration
  - i18n
  - Svelte
  - Developer Experience
  - blog
---

# Paraglide 2.0 Migration – From Framework Glue to Clean Abstraction

From time to time, it's necessary to bring all dependencies up to date. Most of them update easily. Paraglide.js? Definitely not.

This post is not just a dry migration guide — it’s also about the headaches, surprises, and a few decisions you’ll have to make if you’re already deep into a SvelteKit project like I am with [shrtn.io](https://shrtn.io). And while we’re at it: Paraglide’s approach to minimalism still makes me smile — even if it makes the docs a bit too... minimal at times.

That said, version 2.0 is a huge step forward. The documentation is better, the architecture is more maintainable, and the framework independence finally feels real. But not everything is an upgrade — especially not the developer experience when removing some of the SvelteKit-specific helpers.

If you're here just for the code, feel free to skip ahead.

---

## TL;DR

✓ Paraglide 2.0 drops framework-specific packages — use the new Vite plugin.

→ You’ll need to clean up old imports, configs, and the `<ParaglideJS>` wrapper.

! Language switching now requires `data-sveltekit-reload` or a manual `setLocale()`.

\>\> Overall: Fewer moving parts, more clarity — but less convenience in some spots. Otherwise, buckle up: here’s what it took to get Paraglide 2.0 running cleanly in production.

---

## What's New in Paraglide 2.0

Paraglide 2.0 brings several core changes and improvements:

- **Updated to the inlang SDK v2**, now with support for variants (e.g. pluralization).
- **Unified API**, works across frameworks without the need for framework-specific bindings.
- **Supports all major i18n strategies**, including cookie, URL, domain, local storage, and session-based resolution.

### Additional Improvements

- **Nested message keys**: Organize translations in structured hierarchies.
- **Auto-imports**: Translation keys accessed via `m.key` no longer require a manual import.
- **Flexible key naming**: Supports arbitrary key names (even emojis) via `m["🍌"]()`.
- **Incremental migration**: You can gradually adopt Paraglide 2.0 in existing projects.
- **Multi-tenancy support**: Routing can now vary by domain.
- **Compiler API exposed**: Enables advanced automation or custom tooling.
- **Customizable routing strategies**: Choose or mix strategies like cookie or URL.
- **Experimental per-locale bundle splitting**: Potential for reduced bundle sizes.
- **Framework-agnostic SSR middleware**: Works with SvelteKit, Next.js, and others.

---

## Step 1: Native Vite Plugin

[Paraglide.js](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) now ships with a framework-agnostic Vite plugin. No more need for framework-specific packages like `@inlang/paraglide-sveltekit`. I’m also using it in production on [dropanote.de](https://dropanote.de), my own personal website built with embodi — which had no specific Paraglide framework plugin. So having a framework-agnostic plugin is a real win here.

Install the new package and remove the old SvelteKit-specific dependency:

```bash
pnpm add @inlang/paraglide-js
pnpm remove @inlang/paraglide-sveltekit
```

Update your `vite.config.ts`:

```ts
import { paraglideVitePlugin } from "@inlang/paraglide-js/vite";
import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      strategy: ["url", "cookie", "baseLocale"],
    }),
    tailwindcss(),
    sveltekit(),
  ],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});
```

The `strategy` option defines the language resolution order. This is new in Paraglide 2.0.

And yes — this plugin now works across frameworks. That’s actually a big win if you’re aiming for portability or want to reduce tech-specific glue code.

---

## Step 2: New Naming Convention

Paraglide 2.0 introduces a few opinionated renamings. You’ll need to touch both the config and your code.

Update `project.inlang/settings.json`:

```diff
{
  "$schema": "https://inlang.com/schema/project-settings",
- "sourceLanguageTag": "en",
+ "baseLocale": "en",
- "languageTags": ["en", "de"],
+ "locales": ["en", "de"],
- "modules": [
-   "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-empty-pattern@latest/dist/index.js",
-   "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-missing-translation@latest/dist/index.js",
-   "https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-without-source@latest/dist/index.js",
-   "https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@latest/dist/index.js",
-   "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@latest/dist/index.js"
- ],
+ "modules": [
+   "https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@4/dist/index.js",
+   "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js"
+ ],
  "plugin.inlang.messageFormat": {
-   "pathPattern": "./messages/{languageTag}.json"
+   "pathPattern": "./messages/{locale}.json"
  }
}
```

Also update your imports:

```ts
// Before:
import { languageTag } from "$paraglide/runtime";

// After:
import { getLocale } from "@inlang/paraglide-js";
```

The renaming makes things more consistent — and since you're upgrading anyway, now’s a good time for a bit of cleanup. A few search-and-replace rounds, maybe a lint check, and you're done.

---

## Step 3: Remove `i18n.ts`

Yep, it’s gone. Delete `src/lib/i18n.ts`. If that sounds harmless — it’s not. This file was probably imported across your app.

Here’s how to replace its functionality:

### `hooks.server.ts`

Replace `i18n.handle()` with:

```ts
import { paraglideMiddleware } from "$lib/paraglide/server";

const paraglideHandle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(
    event.request,
    ({ request: localizedRequest, locale }) => {
      event.request = localizedRequest;
      return resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lang%", locale),
      });
    },
  );
```

Replace `i18n.reroute()` with:

```ts
import type { Reroute } from "@sveltejs/kit";
import { deLocalizeUrl } from "$lib/paraglide/runtime";

export const reroute: Reroute = (request) => {
  return deLocalizeUrl(request.url).pathname;
};
```

### `+layout.svelte`

The `<ParaglideJS>` component is gone too. RIP.

```diff
- <ParaglideJS {i18n}>
    {@render children()}
- </ParaglideJS>
```

This one hurts. The wrapper used to handle links and localization. Now, you're on your own — you’ll need to wrap links with `localizeHref()` or `localizeUrl()`.

```ts
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { localizeHref } from "$lib/paraglide/runtime";

export const load: PageServerLoad = () => {
  redirect(302, localizeHref("/"));
};
```

This works — but doesn’t feel like progress. What used to be automatic now needs to be handled manually, and that includes setting up language-aware routing and keeping link consistency across layouts. It adds responsibility without offering much in return, at least not immediately.

---

## Step 4: Language Switching

To switch languages manually — for example, in a language selector or after clicking a custom flag icon:

```ts
import { setLocale } from "$lib/paraglide/runtime";
setLocale("en");
```

If you want to support language switching via links — especially in a way that SvelteKit recognizes during navigation — make sure to include the `data-sveltekit-reload` attribute. Without it, the routing won’t fully reset, and language state might not update as expected:

```svelte
<a
  data-sveltekit-reload
  rel="alternate"
  hreflang="en"
  href={localizeHref(page.url.pathname, { locale: 'en' })}>
  EN
</a>
<a
  data-sveltekit-reload
  rel="alternate"
  hreflang="de"
  href={localizeHref(page.url.pathname, { locale: 'de' })}>
  DE
</a>
```

Or use `setLocale()` and a `preventDefault()` if you want to stay in SPA-land — just make sure the updated locale is reflected in the URL as well, or the app might not behave as expected when reloading or sharing links.

If you forget this step, SvelteKit might continue rendering the page in the previous language even after `setLocale()` is called, especially after navigation or reloads. In short: `data-sveltekit-reload` ensures your intent is fully respected. Your call.

---

## Migration Notes & Pitfalls

Here are a few things that caught me off guard or took more time than expected:

~> Removing `<ParaglideJS>` breaks existing localization logic — you’ll need to rebuild it manually.

! Missing `data-sveltekit-reload` can lead to language switches silently failing.

\# Key renaming (`languageTags` → `locales`, etc.) touches a lot of files — don’t underestimate it.

---

## Conclusion

The upgrade to Paraglide.js 2.0 brings fewer files, fewer dependencies, and more architectural clarity. But with that comes less convenience — especially if you relied on the opinionated SvelteKit integrations.

Still, it’s worth the switch. You’ll end up with:

- a framework-independent i18n system
- strong type safety
- and less vendor lock-in

Paraglide isn’t doing the magic for you anymore. Whether that’s a good thing depends on what you value: convenience or control. You now need to be more explicit — which can feel tedious, but also results in code that's easier to reason about and maintain in the long run.
