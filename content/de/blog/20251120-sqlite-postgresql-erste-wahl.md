---
title: "Wie SQLite PostgreSQL als meine erste Wahl abgelöst hat"
description: "Eine Startup-Migration hat mir gezeigt: Einfachheit schlägt vorzeitige Optimierung. Warum SQLite meine Standard-Wahl für neue Projekte wurde, wann PostgreSQL wirklich nötig ist und wie man migriert, wenn man herauswächst."
ref: /en/blog/20251120-sqlite-replaced-postgresql-first-choice/
hero:
  image: $assets/datastorage-01.jpg
  photographer: "Claudio Schwarz"
  photographer_link: https://unsplash.com/@purzlbaum
meta:
  keywords:
    - SQLite Production
    - SQLite vs PostgreSQL
    - Datenbank-Wahl
    - Start Simple
    - Datenbank-Migration
    - SQLite Performance
    - Production-Datenbank
    - Over-Engineering
    - Vorzeitige Optimierung
    - SvelteKit Datenbank
    - WAL Mode
    - libsql
    - Bun SQLite
published: 2025-11-20
layout: $layout/BlogPost.svelte
category: dev
tags:
  - Datenbank
  - SQLite
  - PostgreSQL
  - Architektur
  - Developer Experience
  - Production
  - blog
---

# Wie SQLite PostgreSQL als meine erste Wahl abgelöst hat

MySQL, NoSQL und wieder zurück nach PostgreSQL – so könnte man meine Reise durch die Datenwelten kurz zusammenfassen. Mit dem Aufkommen von NoSQL-Datenbanken haben Datenbanken wie PostgreSQL neue Features eingebaut und sind selbst zu NoSQL (not only SQL) Datenbanken geworden und damit die perfekte All-in-One-Lösung.

SQLite? Fand ich ganz nett für Nextcloud im Heimbetrieb, wenn maximal 3 Nutzer gleichzeitig aktiv sind. Ein nettes Tool zum Starten, aber nichts für Production. Dachte ich zumindest, bis mich ein Kunde überzeugt hat, SQLite als Datenbank für seine Software zu verwenden.

Ich ließ mich ein und frischte mein Wissen auf: Während PostgreSQL und MySQL NoSQL-Datenbanken versuchten, den Rang abzulaufen, hat SQLite an Funktionen gearbeitet, die für Produktivsysteme wichtig sind: Scaleability, Non-Blocking Writes, Performance.

## Das Startup, das zu früh over-engineered hat

Manchmal brauchen wir andere, um uns den Wert in etwas zu zeigen, das wir nicht im Blick haben.

Für mich war das besagter Kunde, der sich komplett festgefahren hatte. Die bestehende Software baute auf Clojure und einem obskuren Datenbanksystem, an dessen Namen ich mich kaum erinnern kann, und steckte komplett fest. Einfache Features dauerten Monate statt Tage. Entwickler mit den richtigen Skills waren unmöglich zu finden, und die Nutzerbasis war immer noch winzig.

Der Plan: Wir migrierten zu SvelteKit und SQLite. Einfach. Schnell. Keine komplexe Infrastruktur zu managen und Unmengen von Entwicklern am Markt. In Pair-Programming führten wir das Team in SvelteKit ein und brachten das neue System live. Features gingen leicht von der Hand und das System brachte mehr als ausreichend Performance.

Leider war es bereits zu spät. Die Anschlussfinanzierung scheiterte und zu viel Geld wurde bereits durch das zu komplexe System verbrannt.

Die Lektion: **Start simple from day one.** Komplexität kommt von alleine und man muss sich ihr anpassen, aber Komplexität um Eventualitäten abzudecken, die eventuell nie eintreten, sind schlussendlich auch technische Schulden. **Der beste Code ist Code, den man nicht braucht.**

## Warum SQLite meine Standard-Wahl wurde

Für alle, die SQLite nicht kennen: Es ist nur eine Datei und eine Bibliothek für deine bevorzugte Programmiersprache. Kein separater Datenbankserver. Kein Docker-Container. Keine komplexe Konfiguration. Du fügst eine Dependency hinzu, verweist auf eine Datei, und fertig.

Diese Einfachheit ist SQLites größte Stärke. Während alle anderen PostgreSQL-Instanzen aufsetzen, Connection-Pools konfigurieren und Datenbankserver verwalten, baust du bereits Features.

Da SQLite als eingebettete Bibliothek in der Anwendung läuft, entfällt die Netzwerk-Latenz komplett. Jede Query ist eine lokale Dateioperation. **Die Performance ist dadurch besser als man denkt.**

Dazu kommt, dass moderne SQLite-Funktionen wie der WAL (Write-Ahead Logging) Mode parallele Lesezugriffe und Schreibvorgänge effizient handhaben – es ist nicht der Single-Threaded Flaschenhals, den viele Entwickler vermuten, und nicht vergleichbar mit dem direkten Zugriff auf eine Datei.

Einen entscheidenden Faktor hat auch die verwendete Library, da sie das Hauptbindeglied darstellt und alle Operationen übernimmt. Bun hat dies erkannt und versucht die Performance mit seiner eigenen Implementierung noch mal erheblich zu steigern.

Andere Libraries wie libsql – das offiziell einen kompatiblen Fork darstellt – heben SQLite noch mal auf eine ganz andere Ebene und erlauben sogar weltweit skalierte Systeme.

Aber egal wie gut die Stabilität oder Performance der Bibliothek ist, eines bleibt der entscheidende Faktor: Die Struktur von SQLite ist so simpel, dass eine Migration zu einer anderen SQL-Datenbank immer möglich und einfach bleibt. **SQLite bietet dir viel Luft zum Atmen, bis du diesen Punkt erreichst.**

## SQLite in Production: Zwei Real-World-Beispiele

**Shrtn** ist ein URL-Shortener mit einem simplen Ziel: So einfach wie möglich zu sein. Einen einzigen Docker-Container starten, Volume mounten, fertig. Kein Redis-Server zu verwalten, kein PostgreSQL zu konfigurieren. Das Datenmodell ist simpel – eine Tabelle für Links, ein bisschen Auth-Daten, das war's. Hätte ich Redis nutzen können? Klar. Aber dann hätte ich einen zweiten Container gebraucht, mehr Konfiguration, mehr Wartungsaufwand. SQLite hält das gesamte Deployment trivial und handhabt alle Redirects problemlos.

**EmbodiCMS** ist ein Git-basiertes CMS, bei dem der eigentliche Content in Git-Repositories liegt. SQLite speichert die Metadaten – OAuth-Accounts, Projekt-Informationen, Artikel-Metadaten für Filterung und Suche. Die Datenbank enthält keinen kritischen Content, nur unterstützende Daten, damit alles funktioniert. Es ist ein natürlicher Architektur-Fit: Git handhabt versionskontrollierten Content, SQLite handhabt die wenigen operativen Daten. Das Projekt steht am Anfang und manchmal mache ich mir Gedanken über die Zukunft, aber aktuell erfüllt SQLite alle Anforderungen mehr als aus.

Beide Projekte beweisen denselben Punkt: **SQLite funktioniert in produktiven Systemen, wenn man sich auf echte Probleme konzentriert statt auf theoretische Skalierung.**

## Wann PostgreSQL die bessere Wahl ist

Versteh mich nicht falsch – PostgreSQL ist eine exzellente Datenbank. Aber die meisten Anwendungen brauchen keine große Palette an Funktionen.

Wenn du Volltextsuche mit Trigrammen, komplexe JSON-Queries oder Document-Management ähnlich wie bei MongoDB brauchst, liefert PostgreSQL. Diese Features existieren aus guten Gründen. Jeder, der schon mal Trigram-Search selbst implementieren musste, wird es zu schätzen wissen, dass es direkt in der Datenbank verfügbar ist.

Aber der Schlüssel ist: **Nutze SQLite, bis du einen nachgewiesenen Bedarf für diese Features hast.** Die meisten Anwendungen stoßen nie an SQLites Grenzen. Und wenn du wechseln musst, weißt du genau, welche Features dir fehlen und welches Datenbanksystem das beste für dich ist.

Starte mit SQLite. Wechsle, wenn du echte Anforderungen hast, nicht theoretische.

## Der Migrationspfad, wenn man aus SQLite herauswächst

Irgendwann kommt vielleicht der Zeitpunkt, an dem man von SQLite weg migrieren muss. SQLites einfache, aufs Wesentliche konzentrierte Struktur macht diese Migration denkbar unkompliziert.

SQLite konzentriert sich auf Standard-SQL und bleibt auf diesem Niveau immer kompatibel zu anderen SQL-Datenbanken wie PostgreSQL, MySQL, OracleDB oder MSSQL. Tools wie `pgloader` machen es einem noch einfacher – kein manuelles Dump-Wrangling nötig.

Um die Migration zu erleichtern, sollte man von Anfang an beachten, SQLite im Strict-Mode zu nutzen. Ohne ihn validiert SQLite nicht gegen das Schema und erlaubt beliebige Werte in den Feldern. Bei sauberer Datenvalidierung sollte das zwar kein Problem sein, aber die Kopfschmerzen sind das Weglassen der Konfiguration definitiv nicht wert.

Zusätzlich und im Allgemeinen sind ORMs wie Drizzle äußerst hilfreich, um Strukturen, Indizes und andere Konfigurationen auf jedes beliebige SQL-Datenbanksystem zu übertragen.

Wenn der tatsächliche Zeitpunkt zur Migration erreicht ist, hat man bereits ein deutlich klareres Bild der Anwendung und rät nicht mehr, sondern weiß genau, was für welches Feature gebraucht wird. Man trifft eine informierte Entscheidung basierend auf echten Production-Daten, nicht auf architektonischer Panik am ersten Tag.

**Starte mit SQLite. Baue dein Produkt. Migriere, wenn du Beweise hast, nicht Vermutungen.** So bleibt man fokussiert darauf, etwas zu bauen, das Leute tatsächlich nutzen wollen.
