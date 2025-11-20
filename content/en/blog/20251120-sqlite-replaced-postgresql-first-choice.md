---
title: "How SQLite Replaced PostgreSQL as My First Choice"
description: "A startup migration taught me that starting simple beats premature optimization. Why SQLite became my default for new projects, when PostgreSQL is actually needed, and how to migrate when you outgrow it."
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

Like a lot of developers, I started with MySQL. But after a while in the NoSQL world and the evolution of PostgreSQL which added more and more NoSQL-like features, I made the switch. Suddenly, I didn't need separate NoSQL databases for most use cases - PostgreSQL could handle JSON documents, full-text search, and more. It felt like the perfect all-in-one solution.
SQLite? That was just the database I used for local development, quick prototypes or local setups I used for private data. A nice tool for getting started, but nothing you'd run in production. Or so I thought.
Then I worked with a customer who challenged that assumption. They convinced me to take a deeper look at SQLite - and I realized how much it had evolved in recent years. Not just in features, but in stability and production-readiness. SQLite was fighting its way out of the "dev database" niche.
That project changed my default choice for new projects entirely.

## The Startup That Over-Engineered Too Early

Sometimes we need others to show us the value in something we've overlooked. For me, that came from a migration project with a struggling startup.
They were stuck in the mud with a niche tech stack - Clojure and an obscure database system I can barely remember the name of. Simple features took months instead of days. Developers with the right skills were impossible to find, and the user base was still small. They needed a radical change.
We migrated to SvelteKit and SQLite. Simple. Fast. No complex infrastructure to manage. Working in pairs, we introduced the team to SvelteKit and got the new system live. It was significantly faster to work with and easier to maintain.
But it was too late. The company had already burned through their runway fighting their complex tech stack. They shut down shortly after launch.
The lesson hit hard: Start simple from day one. Complex tech stacks might sound impressive, but they kill iteration speed when you need it most.

## Why SQLite Became My Default Choice

For anyone unfamiliar with SQLite: it's just a file and a library for your programming language of choice. No separate database server. No Docker container. No complex configuration. You add a dependency, point it at a file, and you're done.
This simplicity is SQLite's greatest strength. While everyone else is setting up PostgreSQL instances, connection pools, and managing database servers, you're already building features.
Performance is better than you'd expect. Because SQLite runs as an embedded library in your application, there's no network latency. Every query is a local file operation. The performance depends heavily on your SQLite library, but modern implementations are fast - Bun's native SQLite integration, for example, takes this to another level for JavaScript developers. For other languages, libsql offers excellent flexibility and performance.
But here's what really matters: you can scale later if you need to. Most applications never reach the point where SQLite becomes a bottleneck. And if you do? Migration is straightforward. By then, you'll actually know your requirements instead of optimizing for theoretical problems.
Stop thinking about scale before you have users to scale for. Start simple. Ship fast. Optimize when you have real data.

## SQLite in Production: Two Real-World Examples

Shrtn is a URL shortener I built with one goal: keep it stupid simple. One Docker container. Mount a volume. Done. No Redis server to manage, no PostgreSQL to configure. The data model is dead simple - a table for links, some auth data, that's it. Could I have used Redis? Sure. But then I'd need a second container, more configuration, more things to maintain. SQLite keeps the entire deployment trivial while handling redirects without any issues.
EmbodiCMS is a Git-based CMS where the actual content lives in Git repositories. SQLite stores the metadata - OAuth accounts, project info, article metadata for filtering and search. The database isn't holding critical content, just supporting data to make everything work. It's a natural architectural fit: Git handles version-controlled content, SQLite handles operational data. As the project grows, the database layer might expand, but right now it does exactly what's needed.
Both projects prove the same point: SQLite works in production when you focus on solving real problems instead of theoretical scale.

## When PostgreSQL Is Actually the Better Choice

Don't get me wrong - PostgreSQL is an excellent database. But most applications don't need its advanced features.
If you need full-text search with trigrams, complex JSON querying, or document-like management similar to MongoDB, PostgreSQL delivers. These features exist for good reasons. Anyone who's tried implementing trigram search from scratch will appreciate having it built into the database.
But here's the key: use SQLite until you have a proven need for these features. Most applications never hit SQLite's limitations. And if you do? You'll know exactly what your requirements are, making it much easier to choose the right database for your specific needs - whether that's PostgreSQL, MySQL, or something else entirely.
Start with SQLite. Switch when you have real requirements, not theoretical ones.

## The Migration Path When You Outgrow SQLite

Eventually, you might need to migrate away from SQLite. But here's the thing: SQLite's simplicity makes that migration straightforward.
Because SQLite uses standard SQL with a simple structure, moving to PostgreSQL, MySQL, or any other SQL database is relatively painless. Tools like pgloader make it even easier - no manual dump wrangling required.
To make migration smoother down the line, use SQLite's strict mode. Without it, SQLite doesn't validate data types against your schema, which can create headaches during migration. An ORM like Drizzle helps too - it abstracts away database-specific quirks and makes switching databases more mechanical.
But here's the real benefit: by the time you need to migrate, you actually understand your requirements. You're not guessing about scale or features anymore. You know what broke, what's slow, and what you need. That makes choosing the right database much easier than trying to predict the future on day one.
Start with SQLite. Migrate when you have evidence, not anxiety.
