---
title: "How Type Branding Solved an 'Impossible' TypeScript Problem"
description: Building type-safe object transformation pipelines in TypeScript seemed impossible until I discovered type branding. Learn how to preserve generic context through function composition.
ref: /de/blog/20250721-typescript-generics-versagen-type-branding/
hero:
  image: $assets/202506-generic-type-branding-typescript.png
  alt: TypeScript code showing type branding pattern
meta:
  keywords:
    - typescript type branding
    - typescript generics
    - typescript pipe
    - object transformation pipelines
    - typescript generic functions
    - type safety
    - function composition
    - typescript advanced types
    - generic type preservation
    - typescript development
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

# How Type Branding Solved an 'Impossible' TypeScript Problem

When I started building object transformation pipelines, I had a primary goal: write code that's easy to read and change. Complex, nested transformations slow down development, make debugging painful, and turn simple changes into archaeology expeditions.

I was tired of seeing patterns like this throughout codebases:

```typescript
// "Organized" version - functions exist, but still verbose
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

Sure, functions exist. But look at all those intermediate variables! Each step needs a meaningful name, and you're constantly tracking variables - reading assignments, remembering what each contains, finding where they're used next, and following the chain of function calls.

What I wanted was something that reads like a recipe:

```typescript
// Clear, step-by-step transformation
const processUser = pipe(addAge, addEmailValidation, addPermissions);
```

Sequential flow. Each step obvious. Easy to add, remove, or reorder transformations. Code that tells you _what_ it does, not _how_ it's nested.

The final piece: write generic transformation functions once, compose them into readable pipelines everywhere with complete type safety.

TypeScript had other plans.

## The Mysterious Loss of Type Information with TypeScript's Generic Functions

Building a `pipe` function in TypeScript is already challenging. Getting the type system to understand what flows through a `reduce` operation, inferring correct return types, handling async/sync mixing—that's a whole technical adventure on its own (and probably deserves its own article).

But I figured I could work around those pipe implementation details. The real problem came when I tried to build the actual transformation functions.

My approach seemed straightforward:

```typescript
// Write once, use with any object that has the right properties
const addAge = <T extends { birthDate: Date }>(person: T) => ({
  age: calculateAge(person.birthDate),
});

const addEmailValidation = <T extends { email: string }>(data: T) => ({
  emailValid: data.email.includes("@"),
});

// Use with different types
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

The vision was simple: generic functions that work with any compatible type, preserving all original properties while adding new ones.

But TypeScript had different ideas:

```typescript
const result1 = processData(user);
// Type: { emailValid: boolean }
// Expected: User & { age: number } & { emailValid: boolean }

const result2 = processData(customer);
// Type: { emailValid: boolean }
// Expected: Customer & { age: number } & { emailValid: boolean }
```

TypeScript lost track of everything. The original `User` type? Gone. The `age` property from the first transformation? Overwritten. My `Customer` with all its properties? Reduced to a single boolean.

The functions worked perfectly at runtime—JavaScript executed correctly and all properties were preserved. But TypeScript's type system had no idea what was happening in the pipeline.

## Attempting TypeScript Generic Type Detection

The problem was clear, but the solution wasn't. How do you tell a type system "this function should merge, not replace" when it has no way to understand that distinction?

I tried several approaches to bridge this gap:

```typescript
// Attempt 1: Use conditional types to detect generics
type IsGeneric<T> = T extends <U>(arg: U) => any ? true : false;
// Doesn't work - TypeScript can't introspect function generics like this

// Attempt 2: Universal generic constraints
type SmartPipe<T extends Record<string, any>> = <F extends (input: T) => any>(
  fn: F,
) => F extends (input: T) => infer R ? (input: T) => T & R : F;
// TypeScript couldn't make the leap from "might be generic" to "should merge"
```

Even when you try to define a function within a generic type, you run into limitations:

```typescript
// This WOULD work at the type level
type AddAge<T extends { birthDate: Date }> = (input: T) => T & { age: number };

// You can use it, but you have to set the generic when you use it:
const addAgeForUser: AddAge<User> = (person) => ({
  age: calculateAge(person.birthDate),
});
```

The limitation is that you have to concrete the generic type T when you USE the type. You can't have a "non-prepared" type that works dynamically with any compatible input.

The normal generic function approach works fine individually:

```typescript
const addAge = <T extends { birthDate: Date }>(
  person: T,
): T & { age: number } => ({
  age: calculateAge(person.birthDate),
});
```

But T cannot be defined inside the type system in a way that allows the pipe system to automatically infer the relationship between input and output types during composition.

The fundamental issue kept surfacing: **there was no automatic way to tell the type system "this generic function should merge its result with the input."**

That's when I remembered the `__brand` pattern I'd seen before. If TypeScript couldn't detect the intent automatically, maybe I could mark functions explicitly. The wrapper function became the vehicle for carrying the type information the pipe system needed.

## The Solution: Type Branding for Automatic Detection

The breakthrough came when I stopped fighting TypeScript's limitations and started working with them. If the type system couldn't automatically detect function intent, what if I made that intent explicit?

The answer was **branding functions so the pipe system could recognize them automatically**:

```typescript
export function enrich<const FI extends AnyObject | undefined, FO>(
  fu: (args: FI) => FO
): GMerge<FI, FO> {
  return (/* implementation */) as GMerge<FI, FO>;
}

export type GMerge<I, O> = GMergeFunction<I, O> & {
  __brand: "GMerge";  // This is the detection key
};
```

The same branding approach works for `pick()` and `omit()` functions too:

```typescript
// GType = GMerge | GPick | GOmit
F[X] extends GType  // Does this function have any brand?
  ? GQueue<F[X], PrevReturn<...>>  // Yes: use branded logic
  : ReturnType<F[X]>               // No: use transformation logic
```

Now the pipe automatically distinguishes between different function types without you having to think about it:

When you write:

```typescript
const processUser = pipe(
  validateInput, // No brand: transforms
  enrich(addAge), // GMerge brand: merges
  pick(["id", "name", "age"]), // GPick brand: picks
  omit(["tempField"]), // GOmit brand: omits
  formatForAPI, // No brand: transforms
);
```

The pipe automatically applies the correct type behavior for each function based on its brand, without you having to specify anything beyond the wrapper function.

## The Original Vision: Finally Achieved

Remember what started this whole journey? I wanted to write generic transformation functions once and use them everywhere, preserving all type information through complex pipelines.

That "impossible" dream? It finally works:

```typescript
// Write once, generic transformation functions
const addTimestamp = enrich(<T extends AnyObject>(obj: T) => ({
  timestamp: new Date(),
}));

const addMetadata = enrich(<T extends AnyObject>(obj: T) => ({
  version: "1.0",
  processed: true,
}));

// Use with any compatible type
const user: User = { id: 1, name: "John", email: "john@example.com" };
const customer: Customer = {
  customerId: "C123",
  tier: "premium",
  email: "test@company.com",
};
const product: Product = { sku: "P456", name: "Widget", price: 29.99 };

// Same pipeline works with all three types
const processAny = pipe(addTimestamp, addMetadata);

const processedUser = processAny(user);
// Type: User & { timestamp: Date } & { version: string; processed: boolean }

const processedCustomer = processAny(customer);
// Type: Customer & { timestamp: Date } & { version: string; processed: boolean }

const processedProduct = processAny(product);
// Type: Product & { timestamp: Date } & { version: string; processed: boolean }
```

Every property preserved. Every type correctly inferred. The generic functions work with any object shape while maintaining complete type safety.

This is the "write once, use everywhere" vision that seemed impossible with TypeScript's limitations - now working perfectly. The `GMerge` branding system enables automatic detection while preserving generic context through the pipe.

## The Cost and Benefits

Let's be honest about what this solution costs and what you get in return.

**The Costs:**

**Runtime overhead** - Each enriched function adds a wrapper call and object spread operation. In performance-critical loops processing thousands of objects per second, this could matter.

**Learning curve** - Your team needs to understand when to use `enrich()` vs regular transformation functions. It's another pattern to learn and remember.

**Can't remove properties** - `enrich()` only adds or modifies properties. To remove properties, you need `omit()` functions or regular transformations. (The [pipe-and-combine](https://github.com/CordlessWool/pipe-and-combine) library ([npm](https://www.npmjs.com/package/pipe-and-combine)) includes `omit()` and `pick()` functions that use the same branding system for type-safe property removal.)

**Function specialization** - Instead of flexible functions that can add, modify, or remove as needed, you now have specialized function types with specific behaviors.

**But here's the key insight:** Most of the complexity happens at compile time, not runtime. All the complex type logic - `GMerge`, `GQueue`, conditional types, generic inference - gets erased when TypeScript compiles to JavaScript. The actual runtime cost is just wrapper functions and object spreading.

**The Benefits:**

**Readability - The Primary Win** - This is the biggest advantage. Pipelines read like business processes:

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

Even non-developers can understand this flow. Compare that to nested function calls or imperative code with intermediate variables. The business logic becomes immediately obvious.

**Reduced documentation needs** - When code reads like business requirements, you need far less external documentation. Good function names eliminate the need to explain what the process does.

**Faster development** - Write generic transformation functions once, use them everywhere with complete type safety.

**Maintainability** - Easy to add, remove, or reorder transformation steps without breaking types.

For most applications, the development speed gains far outweigh the runtime costs. You're trading microseconds for hours of developer time and significantly more maintainable code.
