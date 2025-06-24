---
title: "Paraglide.js Setup: Typsichere i18n ohne Framework-Bindung"
description: Vollständige Setup-Anleitung für Paraglide.js 2.0 mit Vite Plugin. Framework-agnostische i18n ohne Runtime-Overhead, vollständige TypeScript-Unterstützung und automatische Builds.
hero:
  image: $assets/paraglide-setup.jpg
  alt: Paraglide.js Setup-Anleitung
  photographer: "@Tomas Sobek"
  photographer_link: https://unsplash.com/@tomas_nz
meta:
  keywords:
    - paraglide.js
    - paraglide setup
    - framework agnostic i18n
    - vite plugin
    - typsichere internationalisierung
    - zero runtime i18n
    - compile time translations
    - javascript i18n
    - typescript i18n
    - i18n setup anleitung
published: 2025-06-25
updatedAt: 2025-06-25
layout: $layout2/blogPost
category: dev
tags:
  - JavaScript
  - TypeScript
  - i18n
  - Vite
  - Setup Anleitung
  - Developer Experience
  - blog
---

# Paraglide.js Setup: Typsichere i18n ohne Framework-Bindung

Die meisten i18n-Lösungen funktionieren framework-übergreifend, bringen aber Kompromisse mit sich. Runtime-Overhead, komplexe Konfiguration oder schwache TypeScript-Integration. Du bekommst Flexibilität, opferst aber Performance oder Developer Experience.

Paraglide.js geht einen anderen Weg. Die Übersetzungen werden zur Build-Zeit generiert - das bedeutet null Runtime-Overhead, vollständige Typsicherheit und eine einfache API. Keine komplexe Konfiguration, kein aufgeblähtes Bundle, kein Rätselraten welche Übersetzungsschlüssel existieren.

Version 2.0 führte ein framework-agnostisches Vite Plugin ein, das automatisch Builds auslöst wenn sich Übersetzungen ändern und den manuellen Kompilierungsschritt aus v1 überflüssig macht.

Ich nutze Paraglide produktiv auf [dropanote.de](https://dropanote.de), gebaut mit meinem eigenen Site Builder. Hier erkläre ich, warum es besser funktioniert als die Alternativen und wie du es einrichtest.

## Basis-Setup

Starte mit dem init-Befehl:

```bash
npx @inlang/paraglide-js@latest init
```

Das erstellt deine Projektkonfiguration und die Struktur für die Übersetzungsdateien. Anschließend fügst du das Vite Plugin zu deiner `vite.config.ts` hinzu:

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

Das Plugin generiert TypeScript-Funktionen aus deinen Übersetzungsdateien zur Build-Zeit.

## Projektkonfiguration

Die Datei `project.inlang/settings.json` steuert dein Übersetzungs-Setup:

```json
{
  "$schema": "https://inlang.com/schema/project-settings",
  "baseLocale": "en",
  "locales": ["en", "de"],
  "modules": [
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@4/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js"
  ],
  "plugin.inlang.messageFormat": {
    "pathPattern": "./messages/{locale}.json"
  }
}
```

Wichtige Einstellungen:

- `baseLocale` - deine Standard-Sprache (Fallback)
- `locales` - Array aller unterstützten Sprachen
- `pathPattern` - wo Übersetzungsdateien gespeichert werden (`{locale}` wird durch Sprachcodes ersetzt)

Um eine neue Sprache hinzuzufügen, erweiterst du das `locales` Array und erstellst die entsprechende Übersetzungsdatei.

## Übersetzungsdateien

Der init-Befehl erstellt ein `messages/` Verzeichnis mit deinen Übersetzungsdateien. Jede Sprache bekommt ihre eigene JSON-Datei:

```
messages/
├── en.json
└── de.json
```

Deine deutschen Übersetzungen in `messages/de.json`:

```json
{
  "hello": "Hallo",
  "welcome": "Willkommen auf unserer Website",
  "nav_home": "Startseite",
  "nav_about": "Über uns"
}
```

Englische Übersetzungen in `messages/en.json`:

```json
{
  "hello": "Hello",
  "welcome": "Welcome to our site",
  "nav_home": "Home",
  "nav_about": "About"
}
```

Beim Build generiert Paraglide TypeScript-Funktionen für jeden Übersetzungsschlüssel.

## Grundlegende Verwendung

Starte deinen Dev-Server und das Vite Plugin generiert automatisch deine Übersetzungsfunktionen:

```bash
npm run dev
```

Dann importierst du die generierten Message-Funktionen:

```ts
import * as m from "./src/lib/paraglide/messages";
```

Verwende deine Übersetzungen mit vollständiger Typsicherheit:

```ts
// Einfache Messages
m.hello(); // "Hello" oder "Hallo"
m.welcome(); // "Welcome to our site" oder "Willkommen auf unserer Website"

// Verschachtelte Keys
m.nav_home(); // "Home" oder "Startseite"
m.nav_about(); // "About" oder "Über uns"
```

Für Sprachwechsel importierst du die Locale-Funktionen:

```ts
import { setLocale, getLocale } from "./src/lib/paraglide/runtime";
```

Sprachen programmatisch wechseln:

```ts
setLocale("de");
console.log(m.hello()); // "Hallo"

setLocale("en");
console.log(m.hello()); // "Hello"

// Aktuelle Sprache prüfen
console.log(getLocale()); // "en"
```

Dein Editor bietet Autocomplete für alle Übersetzungsschlüssel und TypeScript fängt Tippfehler zur Compile-Zeit ab.

## Parameter in Übersetzungen

Deine Übersetzungen können dynamische Werte mit geschweiften Klammern akzeptieren:

**In deinen Übersetzungsdateien:**

```json
{
  "greeting": "Hallo {name}!",
  "item_count": "Du hast {count} Artikel im Warenkorb",
  "user_profile": "Willkommen zurück, {first_name} {last_name}"
}
```

**In deinem Code:**

```ts
import * as m from "./src/lib/paraglide/messages";

m.greeting({ name: "Alice" }); // "Hallo Alice!"
m.item_count({ count: 5 }); // "Du hast 5 Artikel im Warenkorb"
m.user_profile({
  first_name: "John",
  last_name: "Doe",
}); // "Willkommen zurück, John Doe"
```

TypeScript erzwingt die erforderlichen Parameter - du bekommst Compile-Fehler wenn du sie vergisst oder falsche Namen verwendest.

## Framework-Integration

Der große Vorteil von Paraglide: Es funktioniert identisch in allen Frameworks. Dieselben Imports, dieselben Funktionen, dieselbe API:

```ts
import * as m from "./src/lib/paraglide/messages";
import { setLocale } from "./src/lib/paraglide/runtime";
```

**In Vanilla JavaScript:**

```js
import * as m from "./src/lib/paraglide/messages";
import { setLocale } from "./src/lib/paraglide/runtime";

document.getElementById("title").textContent = m.welcome();

// Sprachwechsel
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

Keine framework-spezifischen Wrapper, keine verschiedenen APIs. Dieselben Übersetzungsfunktionen funktionieren überall, weil es einfach JavaScript-Funktionen sind.

## Erweiterte Konfiguration

### Spracherkennung-Strategie

Konfiguriere, wie Paraglide die Benutzersprache bestimmt:

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

Verfügbare Strategien:

- `url` - prüft den URL-Pfad (`/de/about`)
- `cookie` - prüft auf ein Sprach-Cookie
- `header` - prüft Accept-Language Header (SSR)
- `localStorage` - prüft Browser Local Storage
- `sessionStorage` - prüft Browser Session Storage
- `baseLocale` - fällt auf deine Standard-Sprache zurück

Paraglide probiert diese Strategien der Reihe nach durch, bis eine gültige Sprache gefunden wird. Wenn keine passt, wird die `baseLocale` verwendet.

### Benutzerdefiniertes Output-Verzeichnis

Ändere wo generierte Dateien abgelegt werden:

```ts
paraglideVitePlugin({
  project: "./project.inlang",
  outdir: "./src/i18n", // Benutzerdefinierter Ort
});
```

Dann importierst du von deinem benutzerdefinierten Pfad:

```ts
import * as m from "./src/i18n/messages";
```

## Fazit

Die Bundle-Größe spielt eine entscheidende Rolle. Jedes Kilobyte JavaScript beeinflusst deine Ladezeiten, besonders auf mobilen Geräten.

Herkömmliche i18n-Bibliotheken liefern ihre komplette Runtime an den Browser - Parser, Formatter und Konfigurationslogik. Paraglide kompiliert alles zur Build-Zeit, sodass deine Nutzer nur die tatsächlichen Übersetzungen als einfache JavaScript-Funktionen herunterladen.

Das war der Hauptgrund für meinen Wechsel zu Paraglide bei frontend-gerenderten Seiten. Wenn jedes Byte für die Performance zählt, macht null Runtime-Overhead einen echten Unterschied.

Bei Server-side Rendering ist der Bundle-Größen-Vorteil weniger relevant. Aber für Client-seitige Apps, SPAs und alle frontend-lastigen Projekte bietet Paraglidess Compile-Time-Ansatz messbare Performance-Vorteile.

Die Typsicherheit und Framework-Flexibilität sind willkommene Extras. Die kleineren Bundles sind der Grund für den Wechsel.---
title: "Paraglide.js Setup: Typsichere i18n ohne Framework-Bindung"
description: Vollständige Setup-Anleitung für Paraglide.js 2.0 mit Vite Plugin. Framework-agnostische i18n ohne Runtime-Overhead, vollständige TypeScript-Unterstützung und automatische Builds.
ref: /blog/20250625-paraglide-js-setup-guide
hero:
image: $assets/paraglide-setup.jpg
alt: Paraglide.js Setup-Anleitung
photographer: "@Tomas Sobek"
photographer_link: https://unsplash.com/@tomas_nz
meta:
keywords: - paraglide.js - paraglide setup - framework agnostic i18n - vite plugin - typsichere internationalisierung - zero runtime i18n - compile time translations - javascript i18n - typescript i18n - i18n setup anleitung
published: 2025-06-25
updatedAt: 2025-06-25
layout: $layout2/blogPost
category: dev
tags:

- JavaScript
- TypeScript
- i18n
- Vite
- Setup Anleitung
- Developer Experience
- blog

---

# Paraglide.js Setup: Typsichere i18n ohne Framework-Bindung

Die meisten i18n-Lösungen funktionieren framework-übergreifend, bringen aber Kompromisse mit sich. Runtime-Overhead, komplexe Konfiguration oder schwache TypeScript-Integration. Du bekommst Flexibilität, opferst aber Performance oder Developer Experience.

Paraglide.js ist anders. Compile-time Translation-Generierung bedeutet null Runtime-Overhead, vollständige Typsicherheit und eine einfache API. Keine komplexe Konfiguration, kein Runtime-Bundle-Bloat, kein Rätselraten welche Translation-Keys existieren.

Version 2.0 führte ein framework-agnostisches Vite Plugin ein, das automatisch Builds auslöst wenn sich Übersetzungen ändern und den manuellen Kompilierungsschritt aus v1 eliminiert.

Ich nutze Paraglide produktiv auf [dropanote.de](https://dropanote.de), gebaut mit meinem eigenen Site Builder. Hier erkläre ich, warum es besser funktioniert als die Alternativen und wie du es einrichtest.

## Basis-Setup

Starte mit dem init-Befehl:

```bash
npx @inlang/paraglide-js@latest init
```

Das erstellt deine Projektkonfiguration und Translation-Datei-Struktur. Dann füge das Vite Plugin zu deiner `vite.config.ts` hinzu:

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

Das Plugin generiert TypeScript-Funktionen aus deinen Translation-Dateien zur Build-Zeit.

## Projektkonfiguration

Die `project.inlang/settings.json` Datei steuert dein Translation-Setup:

```json
{
  "$schema": "https://inlang.com/schema/project-settings",
  "baseLocale": "en",
  "locales": ["en", "de", "fr"],
  "modules": [
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-message-format@4/dist/index.js",
    "https://cdn.jsdelivr.net/npm/@inlang/plugin-m-function-matcher@2/dist/index.js"
  ],
  "plugin.inlang.messageFormat": {
    "pathPattern": "./messages/{locale}.json"
  }
}
```

Wichtige Einstellungen:

- `baseLocale` - deine Standard-Sprache (Fallback)
- `locales` - Array aller unterstützten Sprachen
- `pathPattern` - wo Translation-Dateien gespeichert werden (`{locale}` wird durch Sprachcodes ersetzt)

Um eine neue Sprache hinzuzufügen, füge sie zum `locales` Array hinzu und erstelle die entsprechende Translation-Datei.

## Translation-Dateien

Der init-Befehl erstellt ein `messages/` Verzeichnis mit deinen Translation-Dateien. Jede Locale bekommt ihre eigene JSON-Datei:

```
messages/
├── en.json
└── de.json
```

Deine deutschen Übersetzungen in `messages/de.json`:

```json
{
  "hello": "Hallo",
  "welcome": "Willkommen auf unserer Website",
  "nav_home": "Startseite",
  "nav_about": "Über uns"
}
```

Englische Übersetzungen in `messages/en.json`:

```json
{
  "hello": "Hello",
  "welcome": "Welcome to our site",
  "nav_home": "Home",
  "nav_about": "About"
}
```

Wenn du dein Projekt buildest, generiert Paraglide TypeScript-Funktionen für jeden Translation-Key.

## Grundlegende Verwendung

Starte deinen Dev-Server und das Vite Plugin generiert automatisch deine Translation-Funktionen:

```bash
npm run dev
```

Dann importiere die generierten Message-Funktionen:

```ts
import * as m from "./src/lib/paraglide/messages";
```

Nutze deine Übersetzungen mit vollständiger Typsicherheit:

```ts
// Einfache Messages
m.hello(); // "Hello" oder "Hallo"
m.welcome(); // "Welcome to our site" oder "Willkommen auf unserer Website"

// Verschachtelte Keys
m.nav_home(); // "Home" oder "Startseite"
m.nav_about(); // "About" oder "Über uns"
```

Für Sprachwechsel importiere die Locale-Funktionen:

```ts
import { setLocale, getLocale } from "./src/lib/paraglide/runtime";
```

Wechsle Sprachen programmatisch:

```ts
setLocale("de");
console.log(m.hello()); // "Hallo"

setLocale("en");
console.log(m.hello()); // "Hello"

// Aktuelle Locale prüfen
console.log(getLocale()); // "en"
```

Dein Editor bietet Autocomplete für alle Translation-Keys und TypeScript fängt Tippfehler zur Compile-Zeit ab.

## Parameter in Übersetzungen

Deine Übersetzungen können dynamische Werte mit geschweiften Klammern akzeptieren:

**In deinen Translation-Dateien:**

```json
{
  "greeting": "Hallo {name}!",
  "item_count": "Du hast {count} Artikel im Warenkorb",
  "user_profile": "Willkommen zurück, {first_name} {last_name}"
}
```

**In deinem Code:**

```ts
import * as m from "./src/lib/paraglide/messages";

m.greeting({ name: "Alice" }); // "Hallo Alice!"
m.item_count({ count: 5 }); // "Du hast 5 Artikel im Warenkorb"
m.user_profile({
  first_name: "John",
  last_name: "Doe",
}); // "Willkommen zurück, John Doe"
```

TypeScript erzwingt die erforderlichen Parameter - du bekommst Compile-Fehler wenn du sie vergisst oder falsche Namen verwendest.

## Framework-Integration

Das Schöne an Paraglide ist, dass es identisch in allen Frameworks funktioniert. Dieselben Imports, dieselben Funktionen, dieselbe API:

```ts
import * as m from "./src/lib/paraglide/messages";
import { setLocale } from "./src/lib/paraglide/runtime";
```

**In Vanilla JavaScript:**

```js
import * as m from "./src/lib/paraglide/messages";
import { setLocale } from "./src/lib/paraglide/runtime";

document.getElementById("title").textContent = m.welcome();

// Sprachwechsel
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

Keine framework-spezifischen Wrapper, keine verschiedenen APIs zu lernen. Dieselben Translation-Funktionen funktionieren überall, weil es einfach JavaScript-Funktionen sind.

## Erweiterte Konfigurationsoptionen

### Spracherkennung-Strategie

Konfiguriere, wie Paraglide die Benutzersprache bestimmt:

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

Verfügbare Strategien:

- `url` - prüft den URL-Pfad (`/de/about`)
- `cookie` - prüft auf ein Sprach-Cookie
- `header` - prüft Accept-Language Header (SSR)
- `localStorage` - prüft Browser Local Storage
- `sessionStorage` - prüft Browser Session Storage
- `baseLocale` - fällt auf deine Standard-Sprache zurück

Paraglide probiert diese Strategien der Reihe nach bis es eine gültige Locale findet. Wenn keine passt, verwendet es deine `baseLocale`.

### Benutzerdefiniertes Output-Verzeichnis

Ändere wo generierte Dateien abgelegt werden:

```ts
paraglideVitePlugin({
  project: "./project.inlang",
  outdir: "./src/i18n", // Benutzerdefinierter Ort
});
```

Dann importiere von deinem benutzerdefinierten Pfad:

```ts
import * as m from "./src/i18n/messages";
```

## Fazit

Bundle-Größe ist wichtig. Jedes Kilobyte JavaScript beeinflusst deine Seitenladezeiten, besonders auf mobilen Geräten.

Traditionelle i18n-Bibliotheken liefern ihre komplette Runtime an den Browser - Parser, Formatter und Konfigurationslogik. Paraglide kompiliert alles zur Build-Zeit, sodass deine Nutzer nur die tatsächlichen übersetzten Strings als einfache JavaScript-Funktionen herunterladen.

Das war der Hauptgrund warum ich zu Paraglide für meine frontend-gerenderten Seiten gewechselt bin. Wenn jedes Byte für Performance zählt, macht null Runtime-Overhead einen echten Unterschied.

Server-side Rendering? Der Bundle-Größen-Vorteil ist weniger wichtig. Aber für Client-seitige Apps, SPAs und alle frontend-lastigen Projekte liefert Paraglidess Compile-Time-Ansatz messbare Performance-Vorteile.

Die Typsicherheit und Framework-Flexibilität sind nette Boni. Die kleineren Bundles sind der Grund warum es sich lohnt zu wechseln.
