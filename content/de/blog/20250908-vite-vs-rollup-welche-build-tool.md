---
title: "Vite vs. Rollup: Wann welche Build Tool Sinn ergibt"
description: "Vite nutzt Rollup für Builds, glänzt aber bei der Webentwicklung. Erfahre wann du Vite vs Rollup wählen solltest, mit echten Beispielen und Migration-Hinweisen."
ref: /en/blog/20250908-vite-vs-rollup-build-tools/
hero:
  image: $assets/zebra-wiht-two-heads.jpg
  photographer: "@jackcharles"
  photographer_link: https://unsplash.com/@jackcharles
meta:
  keywords:
    - vite vs rollup
    - build tools vergleich
    - wann vite verwenden
    - wann rollup verwenden
    - javascript bundler
    - entwicklungsworkflow
    - webanwendung bundling
    - bibliothek entwicklung
    - esbuild vs rollup
    - frontend tooling
published: 2025-09-08
layout: $layout/BlogPost.svelte
category: dev
tags:
  - JavaScript
  - Build Tools
  - Vite
  - Rollup
  - Developer Experience
  - Frontend Tooling
  - blog
---

# Vite vs. Rollup: Wann welche Build Tool Sinn ergibt

Webpack dominierte jahrelang das Bundling von Anwendungen, während Rollup seine Nische in der Bibliotheks- und Webentwicklung fand. Vite revolutionierte das Spiel, indem es Rollups saubere Production-Builds mit blitzschneller Entwicklung kombinierte.

## Warum Vite so populär wurde

Vite nutzt Rollup für Production-Builds, verändert aber den Entwicklungsworkflow komplett. Anstatt bei jeder Dateiänderung das gesamte Projekt neu zu erstellen wie herkömmliche Setups (Rollup, Webpack, tsup), werden immer nur die einzelnen Dateien neu gerendert die sich auch geändert haben.

Der Geschwindigkeitsunterschied ist signifikant: Vite reagiert in Sekunden oder Millisekunden unabhängig von der Projektgröße, während traditionelle Rollup/Webpack Builds mit der Anzahl der Dateien steigen, da im Watch Mode immer das ganze Projekt neu gebaut wird.

## Warum Vite in der Entwicklung so viel schneller ist

Während der Entwicklung nutzt Vite esbuild für blitzschnelle Transformationen der geänderten Dateien. Dabei werden wie im Abschnitt davor bereits erwähnt nur Dateien neu gerendert, die geändert oder von einem Plugin als veraltet markiert wurden. Letzteres ist notwendig, um Zusammenhänge aufzudecken. Wenn beispielsweise in SvelteKit die Server Route angepasst wird, sollen neue Daten auch im Frontend sichtbar werden.

Für Production-Builds wechselt Vite zu Rollup für bessere Optimierung und Code-Splitting.

Durch die Behandlung von Code durch unterschiedliche Prozesse während des eigentlichen Bauens und dem Entwickeln, entstehen Kompatibilitätsprobleme, die Vite für wichtige Funktionen von Rollup implementiert. Die wichtigsten Funktionen sind dabei `resolve`, `load` und `transform`. Andere werden zwar nicht implementiert, können aber zum Großteil verwendet werden, da sie nur beim Bauen zum Tragen kommen wie zum Beispiel: `buildStart` und `buildEnd`.

Wiederum andere Funktionalitäten von Rollup können gar nicht verwendet werden, da sie das Konvertieren für die Entwicklung verhindern würden – die meisten Fälle werden allerdings abgedeckt.

## Wann Vite verwenden? Wann Rollup?

Wie erklärt, ist Vite in der Entwicklungsphase viel schneller und beim Bauen so zuverlässig wie Rollup. Warum also nicht nur noch Vite verwenden?

Vite legt selbst einen klaren Fokus auf Webanwendungen. Features wie Hot Module Reloading (HMR) ergeben nur Sinn, wenn eine Anwendung eine visuelle Anzeige hat, die mit HMR aktualisiert werden kann.

Beim Erstellen von Bibliotheken ohne visuelle Komponenten gibt es keine Browser-Schnittstellen oder ähnlich verbreitete, um die Daten automatisch zu aktualisieren. Davon abgesehen ist es in solchen Fällen eh viel intelligenter, die Schnittstellen und Funktionen mit Tests zu prüfen, da die Ausgabe einer Datei mit JSON oder XML visuell nur schwer vorzunehmen ist.

Genau hier hat Rollup auch weiterhin ein gutes Standbein und profitiert von seiner Erweiterbarkeit. Bei einfacheren Bibliotheken, in denen diese nicht benötigt wird, ist auch tsup eine gute Alternative.

### Wechsel zwischen Vite und Rollup

Der Wechsel zwischen den beiden Tools ist grundsätzlich möglich, aber nicht garantiert nahtlos. Die meisten Rollup-Plugins verwenden nur grundlegende Funktionen, die Vite unterstützt, wodurch der Übergang von Rollup zu Vite in den meisten Fällen relativ unkompliziert ist.

Die umgekehrte Richtung – Vite-Plugins in Rollup verwenden – funktioniert weitaus problemloser, allerdings verliert man Vite-spezifische Features wie Hot Module Reloading und Development-Server-Fähigkeiten. Da Vite 100% auf Rollup für Production-Builds setzt, funktioniert die Build-Zeit-Funktionalität identisch. Nur im Watch Mode könnte es zu Einschränkungen kommen – für den Watch Mode muss das im Zweifel einzeln geprüft werden. Aufgrund der Ähnlichkeiten gibt es viele Bibliotheken, die genau den gleichen Bereich abdecken und ähnlich bis gleich aufgebaut sind.

Allerdings gibt es Randfälle zu bedenken. Einige erweiterte Plugin-Features, wie Rollups `this.emitFile()` zum Einbinden neuer Dateien in den Build-Prozess, haben keine entsprechenden Implementierungen in Vites Development-Mode. Diese Kompatibilitätslücken sind selten, können aber unerwartete Probleme verursachen, wenn komplexe Setups migriert werden und Plugins voneinander verwendet werden sollen.

### Interessant zu wissen: Sogar Svelte wechselte zu Vite

Obwohl Rich Harris der Vater sowohl von Rollup als auch von Svelte ist, wechselte Svelte zu Vite für bessere Development-Performance. Beim Build gibt es immer noch die volle Power von Rollup, während die Development-Experience erheblich verbessert wurde.

## Fazit

Für die meisten Entwickler, die Webanwendungen erstellen, ist Vite die klare Wahl. Es bietet die Development-Geschwindigkeit, die moderne Teams brauchen, während es Rollups bewährte Production-Stärken nutzt. Rollup bleibt exzellent für Bibliotheken und spezielle Anwendungsfälle, aber für die Mehrheit der Projekte ist es zur mächtigen Engine hinter Vite geworden statt ein tägliches Tool.
