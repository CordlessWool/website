---
title: "Warum ich i18next durch Paraglide.js ersetzt habe"
description: "40KB nur für Übersetzungslogik? Paraglide.js reduziert das auf 2KB und ermöglicht Tree Shaking sowie Build-Time-Optimierung. Warum ich gewechselt bin."
hero:
  image: $assets/paraglide-switch-i18n.jpg
  alt: Person beim Paragliding - symbolisiert den Wechsel zu Paraglide.js
  photographer: "Renato"
  photographer_link: https://unsplash.com/@cvzzn
meta:
  keywords:
    - i18next vs paraglide
    - paraglide.js migration
    - i18next bundle größe
    - build-time i18n
    - tree shaking übersetzungen
    - i18n bundle optimierung
    - frontend performance
    - javascript i18n
    - i18next alternative
    - paraglide js
published: 2025-07-26
layout: $layout2/blogPost
ref: /en/blog/20250726-why-i-replaced-i18next-with-paraglide-js/
category: dev
tags:
  - JavaScript
  - Performance
  - i18n
  - Bundle Optimierung
  - Migration
  - blog
---

# Warum ich i18next durch Paraglide.js ersetzt habe

Die erste Wahl ist selten die beste. Stundenlang Tools zu vergleichen und Dokumentationen zu lesen ist nervig, und die meisten i18n-Bibliotheken sehen ohnehin ziemlich ähnlich aus. Also fiel meine Entscheidung schnell auf die populäre Lösung: i18next.

Aber wie immer hielt ich die Augen offen und entdeckte Paraglide.js - das i18n völlig anders angeht als andere Tools.

Die JavaScript-Welt entwickelt sich hin zu intelligenteren Bundling-Strategien - weg vom Versenden ungenutzten Codes hin zur Build-Time-Optimierung. Während Websites immer größer und komplexer werden, sind die Tools präziser geworden bei dem, was tatsächlich die Nutzer erreicht.

Deshalb bin ich gewechselt.

## Vom Runtime- zum Build-Time-Ansatz

i18next folgt dem traditionellen i18n-Ansatz: alles zur Laufzeit abarbeiten. Bei jedem Seitenaufruf muss es:

- Übersetzungsdateien vom Server laden
- JSON-Strukturen parsen
- Key-Lookups und Interpolation handhaben
- Pluralisierungsregeln verarbeiten

Das funktioniert gut und ist seit Jahren Standard. Aber moderne Build-Tools eröffneten eine andere Möglichkeit.

Paraglide.js verlagert den Großteil der Arbeit in die Build-Zeit. Während der Kompilierung generiert es individuelle JavaScript-Funktionen für jeden Übersetzungsschlüssel.

```typescript
// i18next: Runtime-Verarbeitung
t("welcome_user", { name: "John" });

// Paraglide.js: vorgenerierte Funktionsaufrufe
welcome_user({ name: "John" });
```

Beide Systeme prüfen weiterhin zur Laufzeit die aktuelle Sprache - Nutzer können die Sprache wechseln. Aber während i18next bei jedem Aufruf auch Übersetzungsschlüssel parst und Interpolation abarbeitet, kompiliert Paraglide.js diese Arbeit in gebrauchsfertige Funktionen vor.

Wenn du ein Build-Tool wie Vite verwendest, passiert das automatisch. Deine Nutzer laden die finalen Funktionen statt Übersetzungsverarbeitungslogik.

## Bundle-Größe um über 40KB reduziert

40KB klingen vielleicht nicht viel - "Websites wiegen heutzutage sowieso über 1MB", denkst du vielleicht. Aber jedes KB beeinflusst Core Web Vitals und Mobile Performance. Moderne Build-Tools sind aus gutem Grund präzise beim Eliminieren unnötiger Overhead geworden.

40KB nur für Übersetzungsverarbeitung. Das ist genug Platz für tausende echter Übersetzungsstrings - wahrscheinlich den gesamten Content deiner App in mehreren Sprachen. Paraglide.js reduziert das auf ~2KB.

Der Unterschied kommt auf die Philosophie an: Ergebnisse versenden, nicht Verarbeitungsengines.

Die Migration ist hauptsächlich Suchen-und-Ersetzen-Arbeit:

```regex
Suchen: t\(['"`]([^'"`]+)['"`](?:,\s*(\{[^}]+\}))?\)
Ersetzen: $1($2)
```

Konvertiert beides:

- `t('welcome_message')` → `welcome_message()`
- `t('welcome_user', { name: 'John' })` → `welcome_user({ name: 'John' })`

## Dateigröße egal - einfach Tree Shaken

Das Beste daran: vergiss die Sorge, ob deine Übersetzungsdateien zu groß werden oder ob du sie für Ladegeschwindigkeit reduzieren musst - das passiert automatisch.

**Vorher (i18next):**

```typescript
// Alle Übersetzungen landen beim Nutzer
{
  "welcome_message": "Willkommen!",
  "admin_panel_title": "Admin Dashboard",
  "debug_info": "Debug-Modus aktiv",
  "unused_feature": "Feature nicht implementiert",
  // ... 200+ weitere Übersetzungen
}
```

**Nachher (Paraglide.js):**

```typescript
// Importiere nur was du tatsächlich verwendest
import { welcome_message } from "./messages";
// admin_panel_title, debug_info, unused_feature automatisch eliminiert
```

Bei i18next laden Nutzer alle Übersetzungen, egal ob verwendet oder nicht. Bei Paraglide.js ist die Logik nicht mehr vor Build-Tools versteckt - sie können endlich das tun, wofür sie gemacht sind: deinen Code optimieren. Deine Übersetzungsdateien bleiben vollständig, aber Nutzer bekommen nur das, was dein Code tatsächlich importiert.

Bonus: du kannst umfassende Übersetzungsdateien zwischen Projekten wiederverwenden, ohne dir über Bloat Gedanken zu machen. Alles behalten, nur das Nötige versenden.

## TypeScript-Support als Bonus

Da Paraglide.js TypeScript-kompatiblen Code generiert, bekommst du automatisch nativen TypeScript-Support, wenn du sie direkt importierst. Echtes Autocomplete, echte Parameter-Prüfung, echte Compile-Time-Errors - keine Type-Generierung nötig.

```typescript
import { welcome_user, item_count } from "./messages";

welcome_user({ name: "John" }); // Autocomplete schlägt 'name'-Parameter vor
item_count({ count: "5" }); // TypeScript-Error: 'count' sollte number sein
```

TypeScript kann langsam beim Aufnehmen neuer Übersetzungen sein, was beim schnellen Hinzufügen vieler Übersetzungen spürbar wird.

## Warum ich Build Time gegenüber Runtime bevorzuge

Das läuft auf ein fundamentales Prinzip der Softwareentwicklung hinaus: Dinge einmal machen, das Ergebnis überall wiederverwenden. Warum sollten dieselben Übersetzungen hunderte, tausende oder millionenfach auf die gleiche Weise verarbeitet werden, wenn man es einmal machen könnte?

Bei i18next verarbeitet jeder Nutzer bei jedem Seitenaufruf Übersetzungen identisch. Bei Paraglide.js passiert diese Arbeit einmal während des Builds - und wird dann für immer von jedem Nutzer wiederverwendet.

Auch wenn Rechenleistung heutzutage günstig ist, verbessert diese Philosophie trotzdem die Nutzererfahrung. Warum sollten Nutzergeräte Arbeit machen, die auf deinem Build-Server hätte erledigt werden können? Warum Verarbeitungslogik versenden, wenn du das Ergebnis versenden könntest?

Es geht nicht nur um Performance - es geht darum, Dinge richtig zu machen. Build-Time-Optimierung folgt dem Kernprinzip: einmal schreiben, überall ausführen.
