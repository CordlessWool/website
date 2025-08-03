---
title: "Know Your Dealer: npm's Security Features You're Not Using"
description: "npm gave you security tools, you're just not using them. Learn how to use npm audit, npm outdated, and other built-in security features to make informed decisions about your dependencies."
hero:
  image: $assets/npm-logo.png
  alt: npm Security Guide
  photographer: "@npm"
  photographer_link: https://npmjs.com/
meta:
  keywords:
    - npm audit
    - npm security audit
    - dependency security
    - npm vulnerability scan
    - package security
    - npm outdated
    - package manager security
    - javascript security
    - node.js security
    - supply chain security
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

# Know Your Dealer: npm's Security Features You're Not Using

I trust 700+ strangers with my production code. You probably do too.

Every time you run `npm install`, you're essentially saying "here, random people on the internet, please have access to my filesystem, network, and potentially my users' data." And honestly? That's fine. It's how the modern web works.

npm didn't just make JavaScript development possible – it made it **scalable**. The ability to pull in battle-tested solutions instead of reinventing every wheel turned JavaScript from a toy language into the backbone of the internet.

But here's the thing: npm gave you security tools. You're just not using them.

## The trust equation that actually works

Let me be clear: I'm not here to scare you away from npm. I use pnpm myself (which is built on the same ecosystem), and I install packages daily. The JavaScript ecosystem's strength IS its openness.

But there's a difference between informed trust and blind faith.

**Informed trust:** "I install packages, and I know what I'm installing."
**Blind faith:** "I install packages and hope for the best."

The tools to move from blind faith to informed trust are already sitting in your terminal. You just need to use them.

## npm audit: Your dependency background check

Let's start with the obvious one you've probably ignored: `npm audit`.

```bash
npm audit
```

This command scans your dependency tree against the Node Security Advisory database. It's free, it's built-in, and it finds real vulnerabilities.

**What you'll typically see:**

```
found 12 vulnerabilities (3 low, 6 moderate, 2 high, 1 critical)
run `npm audit fix` to fix them, or `npm audit` for details
```

**The brutal truth:** Most projects have vulnerabilities. That's not necessarily a crisis – it's information.

### Understanding what npm audit actually tells you

Not all vulnerabilities are created equal:

- **Critical/High:** These matter. Fix them.
- **Moderate:** Fix them when convenient, but don't panic.
- **Low:** Usually noise, but worth understanding.

The key is **context**. A vulnerability in a development-only testing library? Probably fine. A vulnerability in your authentication middleware? Not fine.

```bash
# See details, not just summary
npm audit --audit-level=moderate

# Focus on production dependencies only
npm audit --production

# Get machine-readable output for automation
npm audit --json
```

### When npm audit fix actually works (and when it doesn't)

```bash
npm audit fix
```

This auto-updates packages to secure versions. It works about 60-70% of the time for simple cases.

**When it works:** Minor version updates that don't break APIs.
**When it doesn't:** Major version changes, peer dependency conflicts, or packages that simply haven't been updated.

**Pro tip:** Always run your tests after `npm audit fix`. Auto-updates can break things.

For stubborn vulnerabilities:

```bash
# See what would happen without doing it
npm audit fix --dry-run

# Force major version updates (dangerous)
npm audit fix --force
```

## npm outdated: Know what you're missing

Here's a command I actually use regularly:

```bash
npm outdated
```

This shows you which packages have newer versions available. It's not directly about security, but outdated packages are often vulnerable packages.

**The output tells you:**

- Current version installed
- Wanted version (respects your semver range)
- Latest version available
- Where it's defined (package.json vs. dependency)

**My workflow:**

1. `npm outdated` monthly
2. Update patch versions automatically
3. Research major version updates before applying

## The dependency tree: Understanding what you actually installed

```bash
npm ls
```

This shows your complete dependency tree. Prepare to be surprised by how deep it goes.

```bash
# Just top-level dependencies
npm ls --depth=0

# Find specific packages
npm ls package-name

# Production dependencies only
npm ls --production
```

**Why this matters:** You might think you installed 10 packages, but you actually installed 200. Each one is a potential attack vector.

## package-lock.json: Your security anchor

That `package-lock.json` file? It's not just for reproducible builds – it's a security feature.

**Without package-lock.json:** `npm install` might pull different versions each time.
**With package-lock.json:** You get exactly the same dependency tree every time.

**Security implication:** A malicious package can't sneak into your project through a dependency update if your lockfile pins the exact versions.

```bash
# Use this in CI/CD
npm ci

# Not this
npm install
```

`npm ci` installs exactly what's in your lockfile and fails if package.json and lockfile are out of sync.

## Practical security workflow that doesn't suck

Here's what I actually do (and what you should probably do):

### Before adding new packages:

```bash
# Check the package health
npm view package-name

# Look at download stats, maintainers, dependencies
npm view package-name downloads
npm view package-name dependencies
```

### Monthly maintenance:

```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Update what makes sense
npm update
```

### Before releases:

```bash
# Full security check
npm audit --audit-level=low

# Ensure clean lockfile
npm ci
```

## The tools npm gives you (that you're probably not using)

### npm view: Research before you install

```bash
npm view express
npm view express versions --json
npm view express repository
```

### npm explain: Understand why packages are there

```bash
npm explain lodash
```

This tells you which of your dependencies pulled in lodash, so you understand your dependency chain.

### npm doctor: Health check your setup

```bash
npm doctor
```

Checks if your npm installation is healthy and properly configured.

## When to worry (and when not to)

**Worry about:**

- Critical vulnerabilities in production dependencies
- Packages that haven't been updated in 2+ years
- Dependencies with excessive permissions
- Maintainers who disappear

**Don't panic about:**

- Low-severity vulnerabilities in dev dependencies
- Prototype pollution warnings (usually not exploitable)
- Having "a lot" of dependencies (that's normal)

## Red flags that actually matter

After years of using npm/pnpm, here are the actual warning signs:

**Package red flags:**

- Weekly downloads under 1000 (unless it's very niche)
- Last published more than 2 years ago
- Maintainer list is empty or suspicious
- Recent version jumps (1.2.3 → 15.0.0) without clear changelog

**Dependency red flags:**

- Packages that pull in hundreds of sub-dependencies
- Packages that require network access during install
- Packages with vague descriptions or no documentation

## The honest assessment

npm's security model isn't perfect. Supply chain attacks happen. Packages get compromised. Maintainers make mistakes or disappear.

But the alternative – writing everything from scratch – isn't realistic. The JavaScript ecosystem's power comes from its openness and collaboration.

The goal isn't perfect security (impossible) or zero dependencies (impractical). The goal is **informed decisions**.

## Your action plan

**This week:**

1. Run `npm audit` on your main project
2. Check `npm outdated` and update what makes sense
3. Add `npm ci` to your deployment process

**Monthly:**

1. `npm audit && npm outdated`
2. Research and update major dependencies
3. Remove packages you're not actually using

**Before major releases:**

1. Full audit with `npm audit --audit-level=low`
2. Verify production dependencies with `npm ls --production`
3. Test everything after updates

## Know your dealer

npm is an incredible tool that democratized code sharing and made modern web development possible. The fact that you can pull in battle-tested solutions with a single command is genuinely amazing.

But like any powerful tool, it works best when you understand what it's actually doing.

You don't need to become a security expert or audit every line of code in your node_modules. You just need to use the tools npm already gives you.

**Know your dealer.** Know what they're selling you. Make informed decisions.

Your future self (and your users) will thank you.

---

_Using pnpm instead of npm? These principles apply there too – just replace `npm` with `pnpm` in the commands._
