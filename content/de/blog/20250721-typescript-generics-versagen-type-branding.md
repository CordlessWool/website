---
title: "Wenn TypeScript Generics versagen - Type Branding als Rettung"
description: Wenn TypeScript Generics ihre Type-Information verlieren, scheinen type-sichere Pipelines unmöglich. Type Branding löst dieses Problem elegant. Erfahre, wie du generische Kontexte durch Function Composition erhältst.
ref: /en/blog/20250721-typescript-type-branding-generic-functions/
hero:
  image: $assets/202506-generic-type-branding-typescript.png
  alt: TypeScript code showing type branding pattern
meta:
  keywords:
    - typescript type branding
    - typescript generics
    - typescript pipe
    - objekt transformation pipelines
    - typescript generische funktionen
    - type safety
    - function composition
    - typescript erweiterte typen
    - generische typen erhaltung
    - typescript entwicklung
    - pipe and combine
published: 2025-07-21
layout: $layout/BlogPost.svelte
category: dev
tags:
  - TypeScript
  - Generics
  - Type Safety
  - Function Composition
  - Developer Experience
  - blog
---

# Wenn TypeScript Generics versagen - Type Branding als Rettung

Als ich anfing, Objekttransformationen in Pipelines zu bauen, hatte ich ein klares Ziel: Code schreiben, der sich leicht lesen und ändern lässt. Verschachtelte Transformationen verlangsamen die Entwicklung, machen das Debugging zur Qual und verwandeln simple Änderungen in archäologische Ausgrabungen.

Überall sah ich solche Muster in Codebasen:

```typescript
// "Organisierte" Version - Funktionen existieren, aber trotzdem umständlich
const addAge = (user: User) => ({ ...user, age: calculateAge(user.birthDate) });
const addEmailValidation = (user: User) => ({
  ...user,
  emailValid: user.email.includes("@"),
});
const addPermissions = (user: User) => ({
  ...user,
  permissions: getUserPermissions(user.role),
});

const processUser = (user: RawUser) => {
  const withAge = addAge(user);
  const withValidation = addEmailValidation(withAge);
  const withPermissions = addPermissions(withValidation);
  return withPermissions;
};
```

Ja, Funktionen sind da. Aber sieh dir diese ganzen Zwischenvariablen an! Jeder Schritt braucht einen Namen, du musst ständig Variablen verfolgen - Zuweisungen lesen, dir merken was drinsteht, schauen wo sie weiterverwendet werden, der Kette von Funktionsaufrufen folgen.

Was ich wollte, war etwas das sich wie ein Rezept liest:

```typescript
// Klare, schrittweise Transformation
const processUser = pipe(addAge, addEmailValidation, addPermissions);
```

Sequenzieller Ablauf. Jeder Schritt offensichtlich. Einfach zu erweitern, entfernen oder umzusortieren. Code, der zeigt _was_ er macht, nicht _wie_ er verschachtelt ist.

Der fehlende Baustein: generische Transformationsfunktionen einmal schreiben und überall mit vollständiger Type Safety verwenden.

TypeScript hatte andere Pläne.

## Wenn TypeScript's Generic Functions ihre Type-Information verlieren

Eine `pipe`-Funktion in TypeScript zu bauen ist schon herausfordernd genug. Das Type System dazu zu bringen, eine `reduce`-Operation zu verstehen, korrekte Return Types zu inferieren, async/sync zu mischen - das allein ist schon ein technisches Abenteuer (und verdient wahrscheinlich einen eigenen Artikel).

Aber ich dachte, diese Pipe-Details könnte ich umgehen. Das echte Problem kam, als ich die eigentlichen Transformationsfunktionen bauen wollte.

Mein Ansatz schien simpel:

```typescript
// Einmal schreiben, mit jedem passenden Objekt verwenden
const addAge = <T extends { birthDate: Date }>(person: T) => ({
  age: calculateAge(person.birthDate),
});

const addEmailValidation = <T extends { email: string }>(data: T) => ({
  emailValid: data.email.includes("@"),
});

// Mit verschiedenen Types verwenden
const user: User = {
  id: 1,
  name: "Max",
  email: "max@example.com",
  birthDate: new Date("1990-01-01"),
};
const customer: Customer = {
  customerId: "C123",
  email: "test@company.com",
  birthDate: new Date("1985-05-15"),
  tier: "premium",
};

const processData = pipe(addAge, addEmailValidation);
```

Die Idee war einfach: generische Funktionen, die mit jedem kompatiblen Type funktionieren, alle ursprünglichen Properties behalten und neue hinzufügen.

Aber TypeScript dachte anders:

```typescript
const result1 = processData(user);
// Type: { emailValid: boolean }
// Erwartet: User & { age: number } & { emailValid: boolean }

const result2 = processData(customer);
// Type: { emailValid: boolean }
// Erwartet: Customer & { age: number } & { emailValid: boolean }
```

TypeScript verlor alles aus den Augen. Der ursprüngliche `User`-Type? Weg. Die `age`-Property aus der ersten Transformation? Überschrieben. Mein `Customer` mit all seinen Properties? Geschrumpft auf einen einzigen Boolean.

Zur Laufzeit funktionierte alles perfekt - JavaScript führte korrekt aus und alle Properties blieben erhalten. Aber TypeScript's Type System hatte keine Ahnung, was in der Pipeline passierte.

## Auf der Suche nach einer TypeScript Generic Type Detection

Das Problem war klar, die Lösung nicht. Wie sagst du einem Type System "diese Funktion soll mergen, nicht ersetzen", wenn es diese Unterscheidung gar nicht verstehen kann?

Ich probierte verschiedene Ansätze:

```typescript
// Versuch 1: Conditional Types um Generics zu erkennen
type IsGeneric<T> = T extends <U>(arg: U) => any ? true : false;
// Funktioniert nicht - TypeScript kann Function Generics nicht so introspektieren

// Versuch 2: Universelle Generic Constraints
type SmartPipe<T extends Record<string, any>> = <F extends (input: T) => any>(
  fn: F,
) => F extends (input: T) => infer R ? (input: T) => T & R : F;
// TypeScript schaffte den Sprung von "könnte generisch sein" zu "sollte mergen" nicht
```

Selbst wenn du versuchst, eine Funktion innerhalb eines Generic Types zu definieren, stößt du an Grenzen:

```typescript
// Das WÜRDE auf Type-Ebene funktionieren
type AddAge<T extends { birthDate: Date }> = (input: T) => T & { age: number };

// Du kannst es verwenden, musst aber das Generic beim Verwenden setzen:
const addAgeForUser: AddAge<User> = (person) => ({
  age: calculateAge(person.birthDate),
});
```

Die Einschränkung: Du musst den generischen Type T konkretisieren, wenn du den Type VERWENDEST. Du kannst keinen "flexiblen" Type haben, der dynamisch mit jedem passenden Input funktioniert.

Der normale generische Funktionsansatz funktioniert einzeln einwandfrei:

```typescript
const addAge = <T extends { birthDate: Date }>(
  person: T,
): T & { age: number } => ({
  age: calculateAge(person.birthDate),
});
```

Aber T lässt sich im Type System nicht so definieren, dass das Pipe System automatisch die Beziehung zwischen Input- und Output-Types während der Komposition erkennt.

Das grundlegende Problem blieb: **Es gab keine automatische Möglichkeit, dem Type System zu sagen "diese generische Funktion soll ihr Ergebnis mit dem Input mergen."**

Da fiel mir das `__brand`-Pattern wieder ein, das ich mal gesehen hatte. Wenn TypeScript die Absicht nicht automatisch erkennen konnte, konnte ich vielleicht Funktionen explizit markieren. Die Wrapper-Funktion wurde zum Transportmittel für die Type-Information, die das Pipe System brauchte.

## Die Lösung: Type Branding für automatische Erkennung

Der Durchbruch kam, als ich aufhörte gegen TypeScript's Grenzen anzukämpfen und anfing, mit ihnen zu arbeiten. Wenn das Type System Funktionsabsichten nicht automatisch erkennen konnte, warum machte ich diese Absicht nicht explizit?

Die Antwort: **Funktionen branden, damit das Pipe System sie automatisch erkennt**:

```typescript
export function enrich<const FI extends AnyObject | undefined, FO>(
  fu: (args: FI) => FO
): GMerge<FI, FO> {
  return (/* implementation */) as GMerge<FI, FO>;
}

export type GMerge<I, O> = GMergeFunction<I, O> & {
  __brand: "GMerge";  // Das ist der Erkennungsschlüssel
};
```

Der gleiche Branding-Ansatz funktioniert auch für `pick()`- und `omit()`-Funktionen:

```typescript
// GType = GMerge | GPick | GOmit
F[X] extends GType  // Hat diese Funktion eine Brand?
  ? GQueue<F[X], PrevReturn<...>>  // Ja: verwende Brand-Logic
  : ReturnType<F[X]>               // Nein: verwende Transformation-Logic
```

Jetzt unterscheidet die Pipe automatisch zwischen verschiedenen Funktionstypen, ohne dass du darüber nachdenken musst:

```typescript
const processUser = pipe(
  validateInput, // Keine Brand: transformiert
  enrich(addAge), // GMerge Brand: merged
  pick(["id", "name", "age"]), // GPick Brand: picked
  omit(["tempField"]), // GOmit Brand: omitted
  formatForAPI, // Keine Brand: transformiert
);
```

Die Pipe wendet automatisch das richtige Type-Verhalten für jede Funktion an, basierend auf ihrer Brand. Du musst nichts weiter tun als die Wrapper-Funktion verwenden.

## Die ursprüngliche Vision: Endlich erreicht

Erinnerst du dich, womit diese ganze Reise begann? Ich wollte generische Transformationsfunktionen einmal schreiben und überall verwenden, dabei alle Type-Informationen durch komplexe Pipelines erhalten.

Dieser "unmögliche" Traum? Er funktioniert jetzt:

```typescript
// Einmal schreiben, generische Transformationsfunktionen
const addTimestamp = enrich(<T extends AnyObject>(obj: T) => ({
  timestamp: new Date(),
}));

const addMetadata = enrich(<T extends AnyObject>(obj: T) => ({
  version: "1.0",
  processed: true,
}));

// Mit jedem kompatiblen Type verwenden
const user: User = { id: 1, name: "John", email: "john@example.com" };
const customer: Customer = {
  customerId: "C123",
  tier: "premium",
  email: "test@company.com",
};
const product: Product = { sku: "P456", name: "Widget", price: 29.99 };

// Dieselbe Pipeline funktioniert mit allen drei Types
const processAny = pipe(addTimestamp, addMetadata);

const processedUser = processAny(user);
// Type: User & { timestamp: Date } & { version: string; processed: boolean }

const processedCustomer = processAny(customer);
// Type: Customer & { timestamp: Date } & { version: string; processed: boolean }

const processedProduct = processAny(product);
// Type: Product & { timestamp: Date } & { version: string; processed: boolean }
```

Jede Property erhalten. Jeder Type korrekt inferiert. Die generischen Funktionen funktionieren mit jeder Objektform bei vollständiger Type Safety.

Das ist die "einmal schreiben, überall verwenden"-Vision, die mit TypeScript's Grenzen unmöglich schien - jetzt funktioniert sie perfekt. Das `GMerge`-Branding-System ermöglicht automatische Erkennung und erhält den generischen Kontext durch die Pipe.

## Kosten und Nutzen

Seien wir ehrlich: Was kostet diese Lösung und was bekommst du dafür?

**Die Kosten:**

**Runtime Overhead** - Jede angereicherte Funktion fügt einen Wrapper-Aufruf und Object-Spread-Operation hinzu. In performance-kritischen Schleifen mit tausenden Objekten pro Sekunde könnte das relevant werden.

**Lernkurve** - Dein Team muss verstehen, wann `enrich()` statt regulärer Transformationsfunktionen zu verwenden ist. Ein weiteres Pattern zum Lernen und Merken.

**Keine Property-Entfernung** - `enrich()` fügt nur Properties hinzu oder ändert sie. Um Properties zu entfernen, brauchst du `omit()`-Funktionen oder reguläre Transformationen. (Die [pipe-and-combine](https://github.com/CordlessWool/pipe-and-combine) Library ([npm](https://www.npmjs.com/package/pipe-and-combine)) enthält `omit()`- und `pick()`-Funktionen mit dem gleichen Branding-System für type-sichere Property-Entfernung.)

**Funktionsspezialisierung** - Statt flexibler Funktionen, die nach Bedarf hinzufügen, ändern oder entfernen können, hast du jetzt spezialisierte Funktionstypen mit spezifischen Verhaltensweisen.

**Aber hier die wichtige Erkenntnis:** Das meiste der Komplexität passiert zur Compile-Zeit, nicht zur Laufzeit. Die ganze komplexe Type Logic - `GMerge`, `GQueue`, Conditional Types, Generic Inference - wird gelöscht, wenn TypeScript zu JavaScript kompiliert. Die tatsächlichen Runtime-Kosten sind nur Wrapper-Funktionen und Object Spreading.

**Der Nutzen:**

**Lesbarkeit - Der Hauptgewinn** - Das ist der größte Vorteil. Pipelines lesen sich wie Geschäftsprozesse:

```typescript
const processNewUser = pipe(
  validateUserInput,
  addAge,
  addWelcomeTimestamp,
  assignDefaultPermissions,
  sendWelcomeEmail,
  formatForDatabase,
);
```

Selbst Nicht-Entwickler verstehen diesen Ablauf. Vergleiche das mit verschachtelten Funktionsaufrufen oder imperativem Code mit Zwischenvariablen. Die Geschäftslogik wird sofort klar.

**Weniger Dokumentation nötig** - Wenn Code sich wie Geschäftsanforderungen liest, brauchst du viel weniger externe Dokumentation. Gute Funktionsnamen machen Erklärungen überflüssig.

**Schnellere Entwicklung** - Generische Transformationsfunktionen einmal schreiben, überall mit vollständiger Type Safety verwenden.

**Wartbarkeit** - Transformationsschritte einfach hinzufügen, entfernen oder umsortieren, ohne Types zu brechen.

Für die meisten Anwendungen überwiegen die Entwicklungsgeschwindigkeitsgewinne die Runtime-Kosten bei weitem. Du tauschst Mikrosekunden gegen Stunden an Entwicklerzeit und deutlich wartbareren Code.
