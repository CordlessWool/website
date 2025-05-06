---
title: "Paraglide 2.0 Migration – From Framework Glue to Clean Abstraction"
description: A hands-on guide for upgrading to Paraglide.js 2.0 with real-world examples, gotchas, and improved i18n architecture.
ref: /de/blog/20250506-paraglide-migration-2-0-sv
hero:
  image: $assets/paraglide-migration.jpg
  alt: There is no time for this.
  photographer: "@Maximalfocus"
  photographer_link: https://unsplash.com/@maximalfocus?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash
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
tags:
  - JavaScript
  - Migration
  - i18n
  - Svelte
  - Developer Experience
  - blog
---

From time to time it is neccassery to bring all dependencies to the newest version. Most of them are easly updated, paraglide.js definitly not.

I like paraglide.js specialy with the focus of minimalitc. They keep this kredo also for the documentation, so searching for details solutions is a pain.

This is also a good point of Paraglide.js 2.0, the documentation feels more understandable and complete, but there are still some details missing.

If you started with the documenation of paraglide.js 2.0 you can probably jump to the end of this article.

The documenation follows the update of shrtn.io and easy to self host link shortener based on SvelteKit

## Step 1: Native Vite Plugin

Paraglide.js now includes a platform agnotistic vite function, this makes it easier to include it to any framework, without a native parglide dependecy, like my website dropanote.de (based on embodi).

So first we update you paraglide dependecy in package json or install it. At the same time you can remove the sveltekit dependencie `@inlang/paraglide-sveltekit` included in your `package.json`.

Installation:

```bash
pnpm add @inlang/paraglide-js
# or if you updated your package.json
pnpm install
```

Vite-Config erweitern:

```ts
// vite.config.ts
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

Like the Plugin from `@inlang/paraglide-sveltekit` it take an source and ourput dir, to let vite handle the compilation. These could be used for all frameworks now.

`strategy` is an optional parameter and just tells paraglide in which order it should check the language. This is a new feature of paraglide.js 2.0 ([docs](https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy#strategy))

## Step 2: New naming convention

There is some base changes in naming attributes.
Let's start with the config file `project.inlang/settings.json`

```diff
{

	"$schema": "https://inlang.com/schema/project-settings",
-	"sourceLanguageTag": "en",
+ "baseLocale: "en",
-	"languageTags": ["en", "de"],
+ "locales": ["en", "de"],
	"modules": [
-		"https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-empty-pattern@latest/dist/index.js",
-		"https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-missing-translation@latest/dist/index.js",
-		"https://cdn.jsdelivr.net/npm/@inlang/message-lint-rule-without-source@latest/dist/index.js",
-		"https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@latest/dist/index.js",
-		       "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@latest/dist/index.js"
+    "https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@4/dist/index.js",
+    "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js"
	],
	"plugin.inlang.messageFormat": {
-		"pathPattern": "./messages/{languageTag}.json"
+   "pathPattern": "./messages/{locale}.json"
	}


}

```

Important here are the changes of `languageTags` to `locale` and `sourceLanguageTag` to `baseLocale`. These naming convention goes on in the code. If you used the `languageTag` function before you have to replace it with `getLocale`.

## Step 3: Remove `i18n.ts`

The file `src/lib/i18n.ts` could be complete deleted. These trigger some other changes, because it is often imported.

Let's start with `hooks.server.ts`. Replace `i18n.handle()` with:

```ts
import { paraglideMiddleware } from "$lib/paraglide/server";

const paraglideHandle: Handle = ({ event, resolve }) =>
  paraglideMiddleware(
    event.request,
    ({ request: localizedRequest, locale }) => {
      event.request = localizedRequest;
      return resolve(event, {
        transformPageChunk: ({ html }) => {
          //take a look, what you are using in the app.html as lang placeholder
          return html.replace("%lang%", locale);
        },
      });
    },
  );
```

The `i18n.reroute()` in `hookts` could be replace with:

```ts
import type { Reroute } from "@sveltejs/kit";
import { deLocalizeUrl } from "$lib/paraglide/runtime";

export const reroute: Reroute = (request) => {
  return deLocalizeUrl(request.url).pathname;
};
```

How I mentioned, the framework specitic code will be removed. This is one of the more bad parts. You can not use the `ParaglideJS` component in you `+layout.ts` anymore and I couldn't find a replacement for it.

Update your `+layout.ts`:

```ts
  <script lang="ts">
-  	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
-  	import { i18n } from '$lib/i18n';

  	import '../app.css';
  	import Footer from '$lib/comp/Footer.svelte';
  	let { children } = $props();
  </script>

- <ParaglideJS {i18n}>
  	{@render children()}

  	<Footer />
- </ParaglideJS>
```

This component was caring about the links and the localization. Now you have to do it by your own and this one of the biggest disappointments in this upgrade and feels like a step back. You can use `localizeHref` or `localizeUrl` to do this.

Example:

```ts
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { localizeHref } from "$lib/paraglide/runtime";

export const load = (() => {
  redirect(302, localizeHref("/"));
}) satisfies PageServerLoad;
```

## Step 4: Redirect to an other language

If you do not need different URLs you can just do it in JavaScript

```ts
import { setLocale } from "$lib/paraglide/runtime";
setLocale("en");
```

This is how SvelteKit to it in the new Demo for Paraglide.js.
The only solution I found write now for links, is to do a hard reload on the links if this mean it is a language switch.

```
<a
	data-sveltekit-reload
	rel="alternate"
	hreflang="en"
	href={localizeHref(page.url.pathname, { locale: 'en' })}>EN</a
>
<a
	data-sveltekit-reload
	rel="alternate"
	hreflang="de"
	href={localizeHref(page.url.pathname, { locale: 'de' })}>DE</a
>
```

An other solution will be to prevent the default behaver and use `setLocale()`. But do not forget to switch it in the href.
