---
title: "Paraglide 2.0 Migration – Von Framework-Glue zu klarer Abstraktion"
description: Ein technischer Leitfaden zur Migration auf Paraglide.js 2.0 – mit Codebeispielen, Stolpersteinen und Einblicken aus der Praxis.
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
    - internationalisierung
    - vite plugin
    - sveltekit
    - migrationsleitfaden
    - entwicklererfahrung
published: 2025-05-06
updatedAt: 2025-06-03
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

# Paraglide 2.0 Migration – Von Framework-Glue zu klarer Abstraktion

Regelmäßige Updates gehören dazu. Meist läuft das unspektakulär – bei Paraglide.js war das anders: Der Umstieg erfordert einige gezielte Anpassungen und das Aufräumen alter Strukturen.

Ich zeige hier, wie ich [shrtn.io](https://shrtn.io) auf Paraglide 2.0 umgestellt habe – mit allem, was ersetzt, entfernt oder neu gedacht werden musste. Paraglides Minimalismus überzeugt mich, aber die Dokumentation hätte an ein paar Stellen gern etwas mehr Tiefe vertragen.

Mit Version 2.0 wurde viel aufgeräumt: bessere Doku, klare Struktur, keine Framework-Kopplung mehr. Das bringt Vorteile, macht den Umstieg aber an manchen Stellen auch unbequem – vor allem, wenn man sich an SvelteKit-Hilfen gewöhnt hatte.

---

## TL;DR

✓ Paraglide 2.0 ersetzt Framework-spezifische Pakete – zentral ist das neue Vite-Plugin.

→ Alte Imports, Konfigurationen und der `<ParaglideJS>`-Wrapper müssen entfernt oder ersetzt werden.

! Sprachwechsel funktioniert nur noch mit `data-sveltekit-reload` oder `setLocale()`.

\>> Weniger Magie, mehr Klarheit – mit etwas mehr Eigenverantwortung.

---

## Was ist neu in Paraglide 2.0

Paraglide 2.0 bringt mehrere zentrale Neuerungen:

- **Aktualisiert auf das inlang SDK v2**, jetzt mit Unterstützung für Varianten (z. B. Pluralformen)
- **Vereinheitlichte API**, funktioniert ohne Framework-spezifische Bindungen
- **Unterstützt alle gängigen i18n-Strategien**, inklusive Cookie, URL, Domain, Local Storage und Session

### Weitere Verbesserungen

- **Verschachtelte Nachrichtenschlüssel**: Übersetzungen lassen sich hierarchisch strukturieren
- **Auto-Imports**: `m.key` funktioniert ohne manuellen Import
- **Flexible Schlüsselbenennung**: Unterstützt beliebige Schlüsselnamen (auch Emojis) via `m["🍌"]()`
- **Inkrementelle Migration**: Kann schrittweise in bestehende Projekte eingeführt werden
- **Multi-Tenancy-Unterstützung**: Routing kann domänenspezifisch erfolgen
- **Offene Compiler-API**: Für Automatisierung und eigene Tools
- **Anpassbare Routing-Strategien**: Strategien wie Cookie und URL können kombiniert werden
- **Experimentelles Bundle-Splitting pro Sprache**: Potenziell kleinere Bundles
- **Framework-unabhängige SSR-Middleware**: Kompatibel mit SvelteKit, Next.js und anderen

---

## Schritt 1: Vite-Plugin einrichten

Das neue Vite-Plugin ist framework-agnostisch und ersetzt `@inlang/paraglide-sveltekit`. Ich setze es unter anderem auf [dropanote.de](https://dropanote.de) ein – meiner persönlichen Seite, die auf embodi basiert und bisher ohne spezielles Paraglide-Plugin auskam. Der neue Ansatz spart Sonderlösungen – und genau das war der Anstoß zur Umstellung.

```bash
pnpm add @inlang/paraglide-js
pnpm remove @inlang/paraglide-sveltekit
```

Beispiel für `vite.config.ts`:

```ts
import { paraglideVitePlugin } from "@inlang/paraglide-js/vite";
import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/lib/paraglide",
      strategy: ["url", "cookie", "baseLocale"],
    }),
    sveltekit(),
  ],
});
```

Die `strategy`-Option ist neu – sie bestimmt die Auflösungsreihenfolge. [Zur Doku](https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy#strategy).

---

## Schritt 2: Neue Bezeichner in der Config

Paraglide 2.0 bringt neue Bezeichner in die `settings.json`: `sourceLanguageTag` wird zu `baseLocale`, `languageTags` zu `locales`. Auch das Pfad-Muster und die Modul-Einträge wurden überarbeitet – idealer Moment, um veraltete Regeln mit aufzuräumen.

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

Im Code ist ebenfalls Handarbeit nötig – insbesondere bei Stellen, an denen `languageTag` oder verwandte Funktionen wie `languageTag()` oder `languageTags` direkt verwendet wurden. Diese müssen durch `getLocale()` bzw. `locales` ersetzt werden:

```ts
// vorher:
import { languageTag } from "$lib/paraglide/runtime";

// neu:
import { getLocale } from "$lib/paraglide/runtime";
```

Gezieltes Suchen und Ersetzen reicht meist aus. Dynamische Stellen wie Middleware oder Stores nicht vergessen.

---

## Schritt 3: `i18n.ts` entfernen

`i18n.ts` fällt weg – damit auch Middleware, Reroute-Logik und Sprachhandling im Layout. Das muss ersetzt werden.

### `hooks.server.ts`

`i18n.handle()` wurde typischerweise in der Server-Middleware verwendet und übernimmt die Sprach-Erkennung aus URL oder Cookie. Diese Logik wird nun durch `paraglideMiddleware()` ersetzt.

```ts
import { paraglideMiddleware } from "$lib/paraglide/server";

const handle: Handle = ({ event, resolve }) =>
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

### `hooks.ts`

`i18n.reroute()` wurde meist verwendet, um die Sprache aus URLs zu entfernen oder gezielt umzuleiten. Diese Logik übernimmst Du nun selbst – z. B. mit `deLocalizeUrl()`.

```ts
import type { Reroute } from "@sveltejs/kit";
import { deLocalizeUrl } from "$lib/paraglide/runtime";

export const reroute: Reroute = (request) => {
  return deLocalizeUrl(request.url).pathname;
};
```

### `+layout.svelte`

Der Wrapper `<ParaglideJS>` entfällt. Bisher sorgte er automatisch für Sprachzustand und Link-Lokalisierung.

```diff
- <ParaglideJS {i18n}>
    {@render children()}
- </ParaglideJS>
```

Die Lokalisierung von Links musst Du nun explizit selbst vornehmen – zum Beispiel mit `localizeHref()`:

```ts
import { redirect } from "@sveltejs/kit";
import { localizeHref } from "$lib/paraglide/runtime";

export const load = () => {
  redirect(302, localizeHref("/"));
};
```

Das funktioniert – fühlt sich aber nicht wie ein Fortschritt an. Was vorher automatisch lief, muss nun manuell umgesetzt werden: sprachsensitives Routing, konsistente Links im gesamten Layout und mehr. Das bringt zusätzliche Verantwortung mit sich, ohne dass man direkt einen spürbaren Mehrwert davon hat.

---

## Schritt 4: Sprachwechsel

Ohne Wrapper musst Du Sprachwechsel nun selbst behandeln – entweder mit `setLocale()` oder via Link.

```ts
import { setLocale } from "$lib/paraglide/runtime";
setLocale("en");
```

Wenn Du Sprachwechsel über Links umsetzen willst – vor allem so, dass SvelteKit sie beim Navigieren korrekt erkennt –, musst Du das Attribut `data-sveltekit-reload` setzen. Andernfalls wird das Routing nicht vollständig zurückgesetzt und der Sprachstatus bleibt möglicherweise inkonsistent:

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

Alternativ kannst Du auch `setLocale()` mit `preventDefault()` verwenden, wenn Du ganz im SPA-Modus bleiben willst – achte dann aber darauf, dass die aktuelle Sprache auch in der URL steht. Andernfalls verhält sich die App nach einem Reload oder beim Teilen des Links nicht wie erwartet.

Wird dieser Schritt vergessen, kann es passieren, dass SvelteKit die Seite weiterhin in der alten Sprache rendert – selbst nachdem `setLocale()` ausgeführt wurde. Besonders beim Navigieren oder Neuladen tritt das Problem auf. Kurz gesagt: `data-sveltekit-reload` stellt sicher, dass dein Sprachwechsel auch wirklich durchschlägt.

---

## Migrationsnotizen

~> `<ParaglideJS>` entfällt – die bisher automatische Link-Lokalisierung musst Du nun selbst umsetzen.

! `data-sveltekit-reload` ist Pflicht, wenn Sprachwechsel über Links funktionieren soll – sonst bleibt der alte Zustand bestehen.

\# Bezeichner-Änderungen (`languageTags` → `locales`, etc.) ziehen sich durch viele Dateien – Imports, Routenlogik und Stores inklusive.

---

## Fazit

Paraglide 2.0 kappt Framework-Abhängigkeiten – das sorgt für Klarheit, aber auch für Brüche. Wer SvelteKit-spezifische Features genutzt hat, wird an einigen Stellen nacharbeiten müssen.

Dafür gewinnt man: robustere Architektur, klarere Zuständigkeiten und echte Portabilität. Kein Quick Win – aber langfristig sauberer. Für Projekte, die mehrere Frameworks adressieren oder über längere Zeit gepflegt werden, macht sich das bezahlt.
