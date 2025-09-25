---
title: "tsup vs Vite/Rollup: Wann Einfachheit gewinnt"
description: "Das richtige JavaScript Build-Tool für verschiedene Projekt-Anforderungen wählen. Vergleich von tsup mit Vite/Rollup für Anwendungen und Libraries. Inklusive Konfigurations-Beispiele und Entscheidungsframework."
slug: 20250914-tsup-vs-vite-rollup-wann-einfachheit-gewinnt
ref: /en/blog/20250914-tsup-vs-vite-rollup-when-simple-beats-complex/
published: 2025-09-14
hero:
  image: $assets/zebra-fight.jpg
  photographer: "Patrick Kool"
  photographer_link: https://unsplash.com/@patrick62
layout: $layout/BlogPost.svelte
category: dev
meta:
  keywords:
    - tsup vs vite
    - tsup vs rollup
    - javascript build tools
    - typescript library build
    - esm commonjs dual build
    - vite rollup vergleich
    - javascript bundler vergleich
    - library build tools
tags:
  - JavaScript
  - TypeScript
  - Build Tools
  - Developer Experience
  - Vite
  - Rollup
  - tsup
  - blog
---

# tsup vs Vite/Rollup: Einfachheit vs. Flexibilität

[Vite](https://vite.dev/) und [Rollup](https://rollupjs.org/introduction/) sind zu recht zwei bedeutende Größen unter den JavaScript Build-Tools geworden, manchmal ist es aber sinnvoll auf einfachere Lösungen wie [tsup](https://tsup.egoist.dev/#what-can-it-bundle) zu setzen. Im Grunde ist die Frage nicht, welcher JavaScript Bundler "besser" oder schneller ist. Viel wichtiger ist welcher passt zu den Anforderungen ohne das Projekt unnötig komplex zu machen.

In diesem Artikel werden Vite und Rollup nicht weiter miteinander verglichen, da Vite Rollup für Production-Builds verwendet und dessen Plugin-Architektur teilt. Weitere Details zu diesen Technologien und deren Verhältnis kann in den Artikeln [Vite vs Rollup](/de/blog/20250908-vite-vs-rollup-welche-build-tool/) und [Vite vs Webpack](/de/blog/20250417-vite-rollup-webpack/) nachgelesen werden.

## Web-Anwendungen entwickeln: Vite vs tsup

In diesem Fall ist die Entscheidung einfach zu treffen. Der einzige Bereich, in dem tsup Vite übertreffen könnte, ist die Zeit beim Bauen. Da diese hauptsächlich in der CI-Pipeline zum Tragen kommt, sollte sie allerdings keine große Rolle spielen.

Dagegen bietet Vite folgende Vorteile:

- **Dev Server mit Hot Reload** - schnelles Bauen einzelner Module während tsup im Watch-Mode alles neu baut
- **Framework-Integrationen** - React, Next.js, Svelte, SvelteKit, Vue, Nuxt.js
- **Asset-Handling** - Bilder, CSS, Fonts als öffentliche Inhalte oder Manipulationen über Plugins
- **Code Splitting** - automatische Chunk-Optimierung für Anwendungen
- **Plugin-Ökosystem** - tausende anwendungs-fokussierte Plugins

## JavaScript Library-Entwicklung: tsup vs Rollup

Hier wird es jetzt wirklich interessant, da beide Build-Tools in die gleiche Kerbe schlagen. Lass uns also gerne anhand von Anwendungsfällen Vor- und Nachteile aufzeigen.

Vor einigen Jahren begann Node.js den Übergang von CommonJS (CJS) zu ES modules (ESM), da ES modules zum Standard in Web-Browsern wurden. Für Node.js geschriebene CommonJS Module sind hierzu nicht kompatibel - selbst wenn sie keine Node.js-spezifische Funktionalität verwendeten. Der Übergang ist jedoch langsam, und viele bestehende Projekte nutzen immer noch CommonJS als Standard. Um eine hohe Kompatibilität zu anderen Projekten zu halten ist es empfehlenswert eine Bibliothek immer noch in beide Formate zu übersetzen.

### Batterien inklusive - einfache Strukturen mit tsup

Während Rollup zwar die Wahl des Ausgabe-Formats (CJS, ESM) zulässt, muss aber selbst der Ausgabestream verwaltet werden. tsup macht es dem Anwender einfacher und sendet alle Formate in ein Ausgabeverzeichnis und kümmert sich um den Rest selbst. Kein Nachdenken über die Struktur oder wie die Dateien am besten gehandhabt werden – simpel und einfach.

```ts title="tsup.config.ts"
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/exports/lib.ts"],
  outDir: "dist/lib",
  format: ["cjs", "esm"],
  external: ["valibot", "bson"],
  dts: true,
  clean: true,
  splitting: false,
});
```

Auch weitere Einstellungen bleiben simpel und einfach da sie von tsup direkt includiert werden. Dabei beschränkt sich tsup allerdings auf gängige Dateiformate und Sprachen wie `.ts`, `.js`, `.json` und bietet keine Unterstützung für Formate wie Svelte, Vue oder Markdown.

_**Hinweis:** Die Verwendung von Vite schließt andere Tools nicht aus. Libraries können mit tsup gebaut werden, während Vite die App übernimmt. Auch lassen sich Vite Plugins einfach mit tsup bündeln. Wie so oft ist auch hier die Welt nicht nur Schwarz-Weiß._

Im Gegensatz zu tsup konzentriert sich Rollup auf seine Flexibilität und Plugin System. Flexibilität wird hier aber wie so oft mit einer höheren Komplexität erkauft.

### Werkzeugkasten mit vielen Addons - die große Freiheit mit Rollup

Rollup bietet ein umfangreiches Plugin-Ökosystem, das unter anderem die Verarbeitung beliebiger Dateitypen ermöglicht. Das verleiht Rollup Möglichkeiten, die tsup nicht bietet, aber wie bereits erwähnt bringt mehr Flexibilität auch mehr Komplexität mit sich.

```ts title="rollup.config.js"
import typescript from "rollup-plugin-typescript2";
import { dts } from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/entry.ts", // Entry point
    output: [
      {
        file: "dist/lib.cjs", // CommonJS output
        format: "cjs",
        sourcemap: false,
      },
      {
        file: "dist/lib.js", // ESM output
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: [
      nodeResolve(), // Resolve node modules
      typescript({ tsconfig: "./tsconfig.json" }), // TypeScript plugin
    ],
    external: [], // Specify external dependencies here, if any
  },
  {
    input: "./dist/entry.d.ts",
    output: {
      file: "./dist/entry.d.cts", // Generate .cts for CommonJS
      format: "es",
    },
    plugins: [dts()],
  },
];
```

Selbst für TypeScript-Deklarationen braucht es ein extra Plugin mit eigener Konfiguration. Das gibt Rollup die Möglichkeit sich auf das Herzstück zu konzentrieren ohne Sonderfälle wie TypeScript gesondert handhaben zu müssen, verkompliziert aber die Konfiguration enorm. Deswegen bleibt die Empfehlung bei einfachen Libraries ohne Sonderfälle klar bei tsup.

Doch es gibt Fälle die tsup nicht abbilden kann und die Flexibilität von Rollup entscheidend wird. Alle Möglichkeiten von Rollup aufzuzeigen würde den Artikel sprengen, deswegen hier nur ein paar Beispiele:

- Markdown-Dateien direkt zu Komponenten für Dokumentations-Sites umwandeln
- Schemas automatisch zu TypeScript-Typen während des Builds machen
- Separate Versionen für Node.js und Browser erstellen
- SVGs als optimierte Komponenten inline einbetten
- Umgebungs-spezifische Konfigurationen zu Konstanten verarbeiten

## Component Libraries: Ein Sonderfall für Vite

Wir haben das Bauen von Bibliotheken klar Rollup und tsup zugesprochen, dabei aber einen Sonderfall außer Acht gelassen: Component Libraries.

Klar, tsup oder Rollup funktionieren auch hier. Aber Component Libraries sind anders als normale rein funktionale und logische Bibliotheken. Während man funktionale Bibliotheken meist nur mit Unit Tests entwickeln kann, brauchen UI-Komponenten oft visuelle Entwicklung. Hot Reloading, Live-Previews, Storybook-Integration - hier spielt Vite seine Stärken wieder mit seinem Dev-Modus aus.

_**Hinweis:** Auch hier macht am Ende Rollup den Production-Build, wenn Vite verwendet wird. Doch Vite beschleunigt die Entwicklung._

## Wann verwende ich tsup, Rollup oder Vite?

Schlussendlich hängt die Entscheidung vom Projekt ab:

**tsup:** Für normale JavaScript/TypeScript Libraries ohne besondere Anforderungen. Dual ESM/CJS Builds ohne Konfigurationsaufwand.

**Rollup:** Wenn spezielle Plugins oder Build-Transformationen gebraucht werden. Konvertieren spezieller Dateiformate wie Markdown oder Bilder, kontext-abhängige Behandlung von Dateien oder virtuelle Module.

**Vite:** Für Apps und Component Libraries, wo visuelle Entwicklung, Hot Reloading oder Storybook wichtig sind.

### Wie wichtig ist die Geschwindigkeit?

Geschwindigkeit sollte nicht das Hauptkriterium sein, spielt aber trotzdem oft eine Rolle. Rollup ist alleine durch seine Struktur und Flexibilität langsamer. Die Geschwindigkeit hängt oft auch von den Plugins ab. Betrachtet man Vite und tsup muss beachtet werden, dass tsup dem üblichen Watch-Mode-Prinzip folgt und Vite einen komplett neuen Weg bestreitet. Bei der Entwicklung bauen beide Tools auf esbuild auf, doch Vite integriert dabei noch einen modularen Ansatz. Das heißt Vite verarbeitet nur Teile des Projekts bei einer Änderung und gewinnt dadurch einen enormen Geschwindigkeitsvorteil vor allem bei großen Projekten.

Beim Bauen für die Produktionsumgebung setzt Vite hingegen auf Rollup, was es langsamer macht. Doch wie relevant ist das Bauen wenn es automatisch in der CI/CD-Pipeline ausgeführt wird?
