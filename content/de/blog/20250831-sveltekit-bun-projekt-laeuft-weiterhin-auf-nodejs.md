---
title: "Dein SvelteKit Bun Projekt läuft weiterhin auf Node.js"
description: "Warum SvelteKit mit Bun oft noch auf Node.js läuft - Adapter-Probleme, CORS-Fehler und wie du sicher zwischen Adaptern wechselst."
slug: "20250831-sveltekit-bun-projekt-laeuft-weiterhin-auf-nodejs"
ref: "/en/blog/20250831-sveltekit-bun-project-still-runs-on-nodejs/"
hero:
  image: $assets/puzzle-white.jpg
  photographer: "@photography_cb_"
  photographer_link: https://unsplash.com/photography_cb_
meta:
  keywords:
    - SvelteKit Bun Adapter
    - svelte-adapter-bun
    - SvelteKit Node.js
    - Bun Runtime
    - SvelteKit Adapter System
    - CORS Probleme SvelteKit
    - Origin Header SvelteKit
    - Bun vs Node.js
    - SvelteKit Produktion
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

# Dein SvelteKit Bun Projekt läuft weiterhin auf Node.js

Bun ist installiert, das SvelteKit-Projekt eingerichtet `bunx sv create my-app`, der Development-Server läuft `bun run dev` und alles funktioniert einwandfrei. Der Performance-Boost kann starten... doch warte: Der Code läuft immer noch auf der Node.js Engine.

Bun ist zwar mehr als eine Runtime Engine, aber oft läuft im Untergrund immer noch Node.js. Das ist verwirrend, sorgt aber dafür, dass Software und Frameworks weiterhin funktionieren. Nur wenn wirklich ein Bun Server gestartet wird (`Bun.serve()`) oder explizit die Bun Engine erzwungen wird (`--bun`), startet auch wirklich Bun.

## Das SvelteKit Adapter System

Um SvelteKit mit Bun zu starten brauchst du einen passenden Adapter. Der Standard-Adapter von SvelteKit `@sveltejs/adapter-auto` ist im Prinzip ein Wrapper, der gängige Plattformen automatisch erkennt und die richtige Plattform auswählt - allerdings basiert keine davon auf Bun.

```javascript
// svelte.config.js - Standard-Setup
import adapter from "@sveltejs/adapter-auto";

export default {
  kit: {
    adapter: adapter(), // Erkennt Plattform automatisch
  },
};
```

Um sicher zu gehen, dass der richtige Adapter ausgeführt wird, sollte mit dem Festlegen der Platform auch der Adapter fix gesetzt werden. In Verbindung mit einem Backend dürfte das in den meisten Fällen der Node-Adapter sein: `@sveltejs/adapter-node`.

Seit einigen Jahren steht Node.js aber nicht mehr alleine als beliebte JavaScript Engine zur Verfügung. Deshalb gibt es auch SvelteKit-Adapter für andere Systeme wie `svelte-adapter-deno` oder `svelte-adapter-bun`. Beide Projekte sind allerdings Community Projekte und werden nicht durch das Svelte/SvelteKit-Team weiterentwickelt.

```javascript
// Produktions-Server Optionen
import adapter from "@sveltejs/adapter-node"; // ← Am häufigsten verwendet
// import adapter from 'svelte-adapter-deno';     // ← Community gepflegt
// import adapter from 'svelte-adapter-bun';      // ← Community gepflegt

export default {
  kit: {
    adapter: adapter(),
  },
};
```

Das SvelteKit Adapter System ermöglicht es, die Laufzeitumgebung optimal an das System und die Bedürfnisse anzupassen. Leider ist die Dokumentation im Gegensatz zur restlichen Svelte/SvelteKit-Dokumentation sehr minimal.

Das macht Anpassungen an existierenden Adaptern schwieriger und zeitaufwendiger, insbesondere wenn Erfahrung in diesem Bereich fehlt. Der `svelte-adapter-bun` basiert auf einer alten Version des offiziellen `@sveltejs/adapter-node`, hat aber dessen spätere Anpassungen nie ausreichend übernommen. Seine Entwicklung ist in den letzten Jahren zum Stillstand gekommen.

Auch wenn die Änderungen im Adapter System im Verhältnis der restlichen Weiterentwicklungen nur minimal waren, sorgen bereits diese für Einschränkungen in der Nutzung.

## Warum der Bun Adapter erst im Produktivsystem versagt

In der Entwicklung verwendet SvelteKit den Vite Dev-Server - der gewählte Adapter spielt keine Rolle. Auch `localhost` ist vom CORS-Schutz ausgenommen. Erst bei einem echten Deployment mit externer URL werden die Sicherheitsmechanismen aktiv.

SvelteKit blockiert seit den letzten Updates Formular-Routen automatisch gegen externe Zugriffe. Dafür muss der Origin-Header korrekt gesetzt oder die Umgebungsvariable `ORIGIN` definiert sein. Ein Deaktivieren der Schutzmaßnahmen ist zwar möglich, aber nicht ratsam.

Genau hier versagt der Bun Adapter: Obwohl die ORIGIN-Adresse theoretisch gesetzt werden kann, wird sie nicht korrekt an SvelteKit weitergegeben. Form Actions schlagen fehl, weil der Origin-Header fehlt oder falsch übertragen wird.

## Wie man zwischen SvelteKit Adaptern wechselt

Glücklicherweise ist es eine Mücke und kein Elefant, denn das SvelteKit Adapter System bindet nicht an eine Umgebung.

Wenn der Bun Adapter versagt, ist der Wechsel zurück zu `adapter-node` normalerweise eine einzige Konfigurationsänderung:

```diff
// svelte.config.js
- import adapter from 'svelte-adapter-bun';
+ import adapter from '@sveltejs/adapter-node';
```

> Auch wenn ich mir das Adapter System schon angesehen habe und auch schon ein paar Gedanken in ein Update des Bun Adapters gesteckt habe, ist meine Not im Verhältnis zu meiner Zeit allerdings zu gering. Ich bin aber gerne bereit, mich an einer Entwicklung zu beteiligen.

## Warum der Entwicklungsmodus Vite anstelle des SvelteKit Adapters verwendet

Wie bekannt setzt SvelteKit auf Vite auf. Bis die Anwendung gebaut wurde, läuft alles in Vite ab, erst danach kommen die SvelteKit Adapter wirklich zum Tragen.

### Warum Vite einen eigenen Entwicklungsserver hat

Die Kurzversion: Vite behandelt das Neuladen von Dateiänderungen granular, sodass nicht alles neu gebaut werden muss. Dies ist eines der Hauptfeatures von Vite. Durch die Kontrolle über den Dev-Server kann Vite die einzelnen Fragmente einer Route rendern ohne wie bei Rollup die ganze Anwendung neu zu bauen.

### Vite mit Bun verwenden

Für die Verwendung von Bun als Runtime während der Entwicklung muss das `--bun` Flag gesetzt werden:

```bash
bun --bun run dev  # Verwendet Bun Runtime
bun run dev        # Verwendet Node.js Runtime
```

Aber auch ohne die Bun Runtime lassen sich Buns Package Manager, Workspace-Handling und schnellere Task-Ausführung nutzen. Bun-spezifische Bibliotheken wie `bun:sqlite` erfordern jedoch das `--bun` Flag.

## Fazit: Einfach anfangen, später upgraden

Ohne Formulare wird der Bun Adapter wahrscheinlich gut funktionieren. So oder so ist ein späterer Wechsel durch das SvelteKit Adapter System leicht möglich. Das trifft auch für andere Adapter zu - wie die Migration auf Function-basierte Systeme wie Cloudflare Functions oder Pages.
