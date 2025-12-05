---
title: "Kenne deinen Dealer: npm's Security Features die du nicht nutzt"
topic: "Sicherheit"
description: "npm hat dir Security Tools gegeben, du nutzt sie nur nicht. Lerne wie du npm audit, npm outdated und andere eingebaute Security Features verwendest, um informierte Entscheidungen über deine Dependencies zu treffen."
hero:
  image: $assets/npm-logo.png
  alt: npm Security Guide
  photographer: "@npm"
  photographer_link: https://npmjs.com/
meta:
  keywords:
    - npm audit
    - npm security audit
    - dependency sicherheit
    - npm vulnerability scan
    - package sicherheit
    - npm outdated
    - package manager sicherheit
    - javascript sicherheit
    - node.js sicherheit
    - supply chain sicherheit
published: 2025-06-17
layout: $layout/BlogPost.svelte
category: dev
tags:
  - JavaScript
  - npm
  - Security
  - Dependencies
  - DevOps
  - Best Practices
  - blog
---

# Kenne deinen Dealer: npm's Security Features die du nicht nutzt

Ich vertraue 700+ Fremden meinen Production Code an. Du wahrscheinlich auch.

Jedes Mal wenn du `npm install` ausführst, sagst du im Grunde: "Hier, zufällige Leute aus dem Internet, bitte habt Zugang zu meinem Dateisystem, Netzwerk und möglicherweise den Daten meiner Nutzer." Und ehrlich? Das ist in Ordnung. So funktioniert das moderne Web.

npm hat JavaScript-Entwicklung nicht nur möglich gemacht – es hat sie **skalierbar** gemacht. Die Möglichkeit, bewährte Lösungen einzubinden, anstatt jedes Rad neu zu erfinden, verwandelte JavaScript von einer Spielzeugsprache zum Rückgrat des Internets.

Aber hier ist die Sache: npm hat dir Security Tools gegeben. Du nutzt sie nur nicht.

## Die Vertrauensgleichung, die tatsächlich funktioniert

Lass mich klarstellen: Ich bin nicht hier, um dich von npm wegzuschrecken. Ich nutze selbst pnpm (das auf demselben Ökosystem basiert) und installiere täglich Packages. Die Stärke des JavaScript-Ökosystems IST seine Offenheit.

Aber es gibt einen Unterschied zwischen informiertem Vertrauen und blindem Glauben.

**Informiertes Vertrauen:** "Ich installiere Packages und weiß, was ich installiere."
**Blinder Glaube:** "Ich installiere Packages und hoffe das Beste."

Die Tools, um von blindem Glauben zu informiertem Vertrauen zu wechseln, sitzen bereits in deinem Terminal. Du musst sie nur verwenden.

## npm audit: Dein Dependency Background Check

Fangen wir mit dem Offensichtlichen an, das du wahrscheinlich ignoriert hast: `npm audit`.

```bash
npm audit
```

Dieser Befehl scannt deinen Dependency Tree gegen die Node Security Advisory Datenbank. Es ist kostenlos, eingebaut und findet echte Schwachstellen.

**Was du typischerweise siehst:**

```
found 12 vulnerabilities (3 low, 6 moderate, 2 high, 1 critical)
run `npm audit fix` to fix them, or `npm audit` for details
```

**Die brutale Wahrheit:** Die meisten Projekte haben Schwachstellen. Das ist nicht unbedingt eine Krise – es sind Informationen.

### Verstehen, was npm audit dir wirklich sagt

Nicht alle Schwachstellen sind gleich geschaffen:

- **Critical/High:** Diese sind wichtig. Behebe sie.
- **Moderate:** Behebe sie, wenn es passt, aber keine Panik.
- **Low:** Meist Rauschen, aber wert zu verstehen.

Der Schlüssel ist **Kontext**. Eine Schwachstelle in einer Development-only Testing Library? Wahrscheinlich in Ordnung. Eine Schwachstelle in deiner Authentication Middleware? Nicht in Ordnung.

```bash
# Details sehen, nicht nur Zusammenfassung
npm audit --audit-level=moderate

# Nur auf Production Dependencies fokussieren
npm audit --production

# Maschinenlesbare Ausgabe für Automatisierung
npm audit --json
```

### Wann npm audit fix tatsächlich funktioniert (und wann nicht)

```bash
npm audit fix
```

Das updated Packages automatisch auf sichere Versionen. Es funktioniert etwa 60-70% der Zeit für einfache Fälle.

**Wann es funktioniert:** Minor Version Updates, die keine APIs brechen.
**Wann es nicht funktioniert:** Major Version Changes, Peer Dependency Konflikte oder Packages, die einfach nicht updated wurden.

**Pro Tipp:** Führe immer deine Tests nach `npm audit fix` aus. Auto-Updates können Dinge kaputtmachen.

Für hartnäckige Schwachstellen:

```bash
# Sehen was passieren würde, ohne es zu tun
npm audit fix --dry-run

# Major Version Updates erzwingen (gefährlich)
npm audit fix --force
```

## npm outdated: Wisse was dir fehlt

Hier ist ein Befehl, den ich regelmäßig verwende:

```bash
npm outdated
```

Das zeigt dir, welche Packages neuere Versionen verfügbar haben. Es geht nicht direkt um Security, aber veraltete Packages sind oft vulnerable Packages.

**Die Ausgabe sagt dir:**

- Aktuell installierte Version
- Gewollte Version (respektiert deine semver Range)
- Neueste verfügbare Version
- Wo es definiert ist (package.json vs. Dependency)

**Mein Workflow:**

1. `npm outdated` monatlich
2. Patch Versionen automatisch updaten
3. Major Version Updates vor Anwendung recherchieren

## Der Dependency Tree: Verstehen was du tatsächlich installiert hast

```bash
npm ls
```

Das zeigt deinen kompletten Dependency Tree. Bereite dich darauf vor, überrascht zu sein, wie tief er geht.

```bash
# Nur Top-Level Dependencies
npm ls --depth=0

# Spezifische Packages finden
npm ls package-name

# Nur Production Dependencies
npm ls --production
```

**Warum das wichtig ist:** Du denkst vielleicht, du hast 10 Packages installiert, aber tatsächlich sind es 200. Jedes ist ein potenzieller Angriffsvektor.

## package-lock.json: Dein Security Anker

Diese `package-lock.json` Datei? Sie ist nicht nur für reproduzierbare Builds – sie ist ein Security Feature.

**Ohne package-lock.json:** `npm install` könnte jedes Mal verschiedene Versionen ziehen.
**Mit package-lock.json:** Du bekommst jedes Mal exakt denselben Dependency Tree.

**Security Implikation:** Ein bösartiges Package kann sich nicht durch ein Dependency Update in dein Projekt schleichen, wenn deine Lockfile die exakten Versionen pinnt.

```bash
# Verwende das in CI/CD
npm ci

# Nicht das
npm install
```

`npm ci` installiert exakt das, was in deiner Lockfile steht und schlägt fehl, wenn package.json und Lockfile nicht synchron sind.

## Praktischer Security Workflow der nicht nervt

Hier ist was ich tatsächlich mache (und was du wahrscheinlich machen solltest):

### Bevor neue Packages hinzugefügt werden:

```bash
# Package Health checken
npm view package-name

# Download Stats, Maintainer, Dependencies anschauen
npm view package-name downloads
npm view package-name dependencies
```

### Monatliche Wartung:

```bash
# Auf Schwachstellen prüfen
npm audit

# Auf veraltete Packages prüfen
npm outdated

# Das updaten, was Sinn macht
npm update
```

### Vor Releases:

```bash
# Vollständiger Security Check
npm audit --audit-level=low

# Saubere Lockfile sicherstellen
npm ci
```

## Die Tools die npm dir gibt (die du wahrscheinlich nicht nutzt)

### npm view: Recherchiere bevor du installierst

```bash
npm view express
npm view express versions --json
npm view express repository
```

### npm explain: Verstehe warum Packages da sind

```bash
npm explain lodash
```

Das sagt dir, welche deiner Dependencies lodash reingezogen haben, sodass du deine Dependency Chain verstehst.

### npm doctor: Health Check für dein Setup

```bash
npm doctor
```

Überprüft, ob deine npm Installation gesund und richtig konfiguriert ist.

## Wann du dir Sorgen machen solltest (und wann nicht)

**Sorgen machen über:**

- Kritische Schwachstellen in Production Dependencies
- Packages, die 2+ Jahre nicht updated wurden
- Dependencies mit exzessiven Berechtigungen
- Maintainer, die verschwinden

**Keine Panik über:**

- Low-Severity Schwachstellen in Dev Dependencies
- Prototype Pollution Warnungen (meist nicht ausnutzbar)
- "Viele" Dependencies zu haben (das ist normal)

## Red Flags die wirklich wichtig sind

Nach Jahren der npm/pnpm Nutzung sind hier die tatsächlichen Warnzeichen:

**Package Red Flags:**

- Wöchentliche Downloads unter 1000 (außer es ist sehr nischig)
- Letzte Veröffentlichung vor mehr als 2 Jahren
- Maintainer Liste ist leer oder verdächtig
- Kürzliche Versionssprünge (1.2.3 → 15.0.0) ohne klares Changelog

**Dependency Red Flags:**

- Packages die hunderte von Sub-Dependencies reinziehen
- Packages die Netzwerkzugang während Install benötigen
- Packages mit vagen Beschreibungen oder ohne Dokumentation

## Die ehrliche Einschätzung

npm's Security Model ist nicht perfekt. Supply Chain Attacks passieren. Packages werden kompromittiert. Maintainer machen Fehler oder verschwinden.

Aber die Alternative – alles von Grund auf selbst zu schreiben – ist nicht realistisch. Die Macht des JavaScript-Ökosystems kommt von seiner Offenheit und Zusammenarbeit.

Das Ziel ist nicht perfekte Sicherheit (unmöglich) oder null Dependencies (unpraktikabel). Das Ziel sind **informierte Entscheidungen**.

## Dein Aktionsplan

**Diese Woche:**

1. Führe `npm audit` auf deinem Hauptprojekt aus
2. Checke `npm outdated` und update was Sinn macht
3. Füge `npm ci` zu deinem Deployment Prozess hinzu

**Monatlich:**

1. `npm audit && npm outdated`
2. Recherchiere und update Major Dependencies
3. Entferne Packages die du nicht wirklich nutzt

**Vor Major Releases:**

1. Vollständiger Audit mit `npm audit --audit-level=low`
2. Verifiziere Production Dependencies mit `npm ls --production`
3. Teste alles nach Updates

## Kenne deinen Dealer

npm ist ein unglaubliches Tool, das Code-Sharing demokratisiert und moderne Web-Entwicklung möglich gemacht hat. Die Tatsache, dass du bewährte Lösungen mit einem einzigen Befehl einbinden kannst, ist wirklich erstaunlich.

Aber wie jedes mächtige Tool funktioniert es am besten, wenn du verstehst, was es tatsächlich macht.

Du musst kein Security Expert werden oder jede Zeile Code in deinen node_modules auditieren. Du musst nur die Tools verwenden, die npm dir bereits gibt.

**Kenne deinen Dealer.** Wisse was sie dir verkaufen. Treffe informierte Entscheidungen.

Dein zukünftiges Ich (und deine Nutzer) werden es dir danken.

---

_Nutzt du pnpm statt npm? Diese Prinzipien gelten dort auch – ersetze einfach `npm` mit `pnpm` in den Befehlen._
