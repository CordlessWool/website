---
title: "How SQLite Replaced PostgreSQL as My First Choice"
description: "A startup migration taught me that starting simple beats premature optimization. Why SQLite became my default for new projects, when PostgreSQL is actually needed, and how to migrate when you outgrow it."
topic: Database
ref: /de/blog/20251120-sqlite-postgresql-erste-wahl/
hero:
  image: $assets/datastorage-01.jpg
  photographer: "Claudio Schwarz"
  photographer_link: https://unsplash.com/@purzlbaum
meta:
  keywords:
    - SQLite production
    - SQLite vs PostgreSQL
    - database choice
    - start simple
    - database migration
    - SQLite performance
    - production database
    - over-engineering
    - premature optimization
    - SvelteKit database
    - WAL mode
    - libsql
    - Bun SQLite
published: 2025-11-20
layout: $layout/BlogPost.svelte
category: dev
tags:
  - Database
  - SQLite
  - PostgreSQL
  - Architecture
  - Developer Experience
  - Production
  - blog
---

# How SQLite Replaced PostgreSQL as My First Choice

MySQL, NoSQL, and back to PostgreSQL – that's my journey through the database world in a nutshell. With the rise of NoSQL databases, systems like PostgreSQL added new features and evolved into NoSQL (not only SQL) databases themselves, becoming the perfect all-in-one solution.

SQLite? I found it nice enough for Nextcloud at home when at most 3 users were active simultaneously. A nice tool for getting started, but nothing for production. Or so I thought, until a customer convinced me to use SQLite as the database for his software.

I gave it a shot and refreshed my knowledge: While PostgreSQL and MySQL were trying to compete with NoSQL databases, SQLite was working on features important for production systems: Scaleability, Non-Blocking Writes, Performance.

## The Startup That Over-Engineered Too Early

Sometimes we need others to show us the value in something we've overlooked.

For me, that was said customer who had gotten completely stuck. The existing software was built on Clojure and an obscure database system whose name I can barely remember, and was completely stuck. Simple features took months instead of days. Developers with the right skills were impossible to find, and the user base was still tiny.

The plan: We migrated to SvelteKit and SQLite. Simple. Fast. No complex infrastructure to manage and tons of developers in the market. Through pair programming, we introduced the team to SvelteKit and got the new system live. Features flowed easily and the system delivered more than enough performance.

Unfortunately, it was already too late. Follow-up funding failed and too much money had already been burned through the overly complex system.

The lesson: **Start simple from day one.** Complexity comes naturally and you have to adapt to it, but complexity to cover eventualities that may never occur is ultimately technical debt too. **The best code is code you don't need.**

## Why SQLite Became My Default Choice

For those unfamiliar with SQLite: it's just a file and a library for your preferred programming language. No separate database server. No Docker container. No complex configuration. You add a dependency, point to a file, and you're done.

This simplicity is SQLite's greatest strength. While everyone else is setting up PostgreSQL instances, configuring connection pools, and managing database servers, you're already building features.

Since SQLite runs as an embedded library in your application, network latency is completely eliminated. Every query is a local file operation. **Performance is better than you'd think.**

Additionally, modern SQLite features like WAL (Write-Ahead Logging) mode handle concurrent reads and writes efficiently – it's not the single-threaded bottleneck many developers assume, and not comparable to direct file access.

The library used is also a decisive factor, as it serves as the main link and handles all operations. Bun recognized this and is trying to significantly boost performance with its own implementation.

Other libraries like libsql – which officially represents a compatible fork – take SQLite to a whole different level and even enable globally scaled systems.

But no matter how good the stability or performance of the library is, one thing remains the deciding factor: SQLite's structure is so simple that migration to another SQL database always remains possible and easy. **SQLite gives you plenty of room to breathe until you reach that point.**

## SQLite in Production: Two Real-World Examples

**Shrtn** is a URL shortener with one simple goal: to be as simple as possible. Start a single Docker container, mount a volume, done. No Redis server to manage, no PostgreSQL to configure. The data model is simple – one table for links, some auth data, that's it. Could I have used Redis? Sure. But then I would have needed a second container, more configuration, more maintenance overhead. SQLite keeps the entire deployment trivial and handles all redirects without issues.

**EmbodiCMS** is a Git-based CMS where the actual content lives in Git repositories. SQLite stores the metadata – OAuth accounts, project information, article metadata for filtering and search. The database doesn't hold critical content, just supporting data to make everything work. It's a natural architectural fit: Git handles version-controlled content, SQLite handles the few operational data points. The project is in its early stages and sometimes I wonder about the future, but currently SQLite fulfills all requirements and then some.

Both projects prove the same point: **SQLite works in production systems when you focus on real problems instead of theoretical scaling.**

## When PostgreSQL Is Actually the Better Choice

Don't get me wrong – PostgreSQL is an excellent database. But most applications don't need a large palette of features.

If you need full-text search with trigrams, complex JSON queries, or document management similar to MongoDB, PostgreSQL delivers. These features exist for good reasons. Anyone who has had to implement trigram search themselves will appreciate having it available directly in the database.

But here's the key: **Use SQLite until you have a proven need for these features.** Most applications never hit SQLite's limits. And when you need to switch, you know exactly which features you're missing and which database system is best for you.

Start with SQLite. Switch when you have real requirements, not theoretical ones.

## The Migration Path When You Outgrow SQLite

Eventually, the time may come when you need to migrate away from SQLite. SQLite's simple, essentials-focused structure makes this migration remarkably straightforward.

SQLite focuses on standard SQL and remains compatible at this level with other SQL databases like PostgreSQL, MySQL, OracleDB, or MSSQL. Tools like `pgloader` make it even easier – no manual dump wrangling required.

To facilitate migration, you should use SQLite in strict mode from the start. Without it, SQLite doesn't validate against the schema and allows arbitrary values in fields. With proper data validation, this shouldn't be a problem, but the headaches aren't worth skipping this configuration.

Additionally and in general, ORMs like Drizzle are extremely helpful for transferring structures, indexes, and other configurations to any SQL database system.

When the actual time for migration arrives, you already have a much clearer picture of the application and aren't guessing anymore, but know exactly what's needed for which feature. You make an informed decision based on real production data, not architectural panic on day one.

**Start with SQLite. Build your product. Migrate when you have evidence, not assumptions.** That's how you stay focused on building something people actually want to use.
