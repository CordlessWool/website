---
title: "Dynamic PDF Generation: Variable Content and Reliable Page Breaks"
description: "How browser-based measurement solved what CSS print media couldn't: reliable page breaks for variable-length content. SvelteKit + Puppeteer approach for complex PDF generation."
ref: /de/blog/20250805-dynamische-pdf-generierung-puppeteer
hero:
  image: $assets/dynamic-pdf-generation-puppeteer.png
  alt: Browser-based PDF generation with variable content
meta:
  keywords:
    - PDF generation
    - Puppeteer PDF
    - browser-based measurement
    - variable content PDF
    - SvelteKit PDF generation
    - React PDF generation
    - Vue PDF generation
    - dynamic page breaks
    - CSS print media
    - document generation
published: 2025-08-05
layout: $layout/BlogPost.svelte
category: dev
tags:
  - JavaScript
  - PDF Generation
  - Puppeteer
  - Automation
  - Document Generation
  - Developer Experience
  - blog
---

# Dynamic PDF Generation: Variable Content and Reliable Page Breaks

In the mind of a developer grown up with responsive webpages, PDF generation is also a mindset challenge – a PDF is totally fixed. You design for infinite scroll, flexible containers, and content that adapts to any screen size.

PDF generation flips everything: exact page dimensions, manual positioning, content that must fit within rigid boundaries. And here's the kicker – you often don't know how much content you'll have until runtime. Will this document be 1 page or 10?

I'll take you on my journey to bridge these two worlds: keeping the dynamic, flexible thinking of web development while working within the constraints of print formats.

**TL;DR:**

- **Problem**: CSS print media fails for variable content lengths (3 items vs 300 items)
- **Solution**: Let the browser render content, then measure actual results instead of calculating positions
- **Tech**: Puppeteer + any framework (React/Vue/Svelte) - framework-agnostic approach
- **Performance**: 3-4 seconds for 6-page PDFs with hundreds of data points
- **Best for**: Complex, data-driven documents with unpredictable lengths

[Skip to the challenge](#section-the-challenge-real-world-complexity) for requirements, or jump to [the solution](#section-the-solution-browser-based-measurement) for implementation details.

## The Story: From Personal Frustration to Production Challenge

I've been frustrated with updating CVs in different languages for years. Especially when I add some of the information also to my website and with every year there is a new platform to enter this data.

For myself my website is the main source, but all the recruiters and companies still want to have a PDF. So why not just put the project overview page into a PDF? I didn't think it would be so complicated. I tried to handle it with `@pages`, `page-break-before` - you name it. But the result was ugly all the time. My webpage is responsive, but the design is not thought for printing it.

So I developed new ideas, set a completely new starting point and searched for tools to solve it. I read a lot of docs about existing PDF generating tools, but often didn't find what I was searching for – a flexible design easy to add elements. I wanted to have a design where I just add elements like on a webpage and they flow from each page to the other.

All ideas I had seemed to be complex and I feared the rabbit hole I could get stuck in. But then I got a new customer and they requested exactly this. I still was nervous about unfinished thoughts, but I had it on my list for months or years, so I decided to do it and it was a fun challenge that definitely turned out to be possible.

## The Challenge: Real-World Complexity

That customer project request came at exactly the right time. They needed automated PDF generation for warehouse pick lists with **hundreds generated daily** - variable content from 3 to **100+ items**, location-based grouping, and zero tolerance for ugly output or slow generation.

The requirements killed any hope of using CSS print media:

- **Unknown content length** with wildly varying item counts
- **Location-based grouping** where headers needed to stay with their content
- **Repeating table headers** across pages (CSS `thead` repetition is unreliable)
- **Different layouts** - full header on page 1, minimal headers on subsequent pages
- **Production speed** - had to generate quickly under real warehouse load

Traditional "design for print" approaches were completely inadequate. Every PDF would be structurally different, and any solution that was slow or unreliable would break their daily operations.

But the timing was perfect - I had months of mental groundwork done, and now I had a real customer need pushing me to finally solve it.

## The Solution: Browser-Based Measurement

The breakthrough came from a simple realization: stop trying to predict layout and start measuring actual results. Instead of calculating font heights and estimating line breaks, let the browser do what it does best - render content - then measure what actually happened.

My first version used the styling information - font heights, padding, margins - as inputs to calculate the total content height. The problem wasn't the calculation itself, but the architecture it required. You need one central definition of all styling values, then pass them correctly to both the backend calculation logic and the frontend components. This creates a tight coupling between your layout calculations and your styling.

The real pain comes when you want to make styling changes. Adding a margin isn't just adding a CSS class anymore - it becomes complex because you have to coordinate the change across both the calculation system and the rendering system. Simple styling decisions become architectural decisions.

With complex document structures, this becomes unmanageable. Every styling tweak requires understanding and updating the calculation logic.

The browser-based approach eliminates this entirely. The browser handles all styling calculations internally - margins, padding, font rendering, line breaks - and I just measure the final rendered result. Want to add a margin? Just add the CSS class. The measurement system automatically adapts to whatever the browser renders.

## The Architecture

**SvelteKit** handles the document structure in my implementation, but this approach works with any framework - **React**, **Vue**, or even plain HTML. The core measurement logic is framework-agnostic, though faster-rendering frameworks will generate PDFs quicker since the approach relies on actual DOM rendering.

Components make development easier and follow modern patterns, but they're not required.

**Puppeteer** generates the actual PDFs using Chrome's print engine. This is crucial: Puppeteer doesn't just take screenshots. The resulting PDFs have selectable text, proper fonts, and professional document quality - real PDFs that can be searched, archived, and printed cleanly.

The API is simple:

```javascript
import puppeteer from "puppeteer";

// Launch browser and generate PDF
const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto(documentURL, {
  waitUntil: "networkidle0",
});

const pdf = await page.pdf({
  format: "A4",
  margin: { bottom: 0, top: 0, right: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();
```

## How the Measurement Works

Every page starts as a frame where you add different elements. Some are fixed (headers, footers), others are content areas that can span multiple pages. When a content area detects that new items won't fit, it triggers the creation of a new page. The key insight: let the browser render everything first, then measure the results.

```mermaid
flowchart TD
    A(["Call to API"]) --> B["Validate and structure data"]
    B --> C["Add page"]
    C --> D["Get element from array and add it to current page"]
    D --> E{"Does content fit on page?"}
    E -- Yes --> F{"More items to add?"}
    E -- No --> G["Put last element back to stack"]
    G --> C
    F -- Yes --> D
    F -- No --> L(["Create PDF"])
```

The process is simple: add elements one by one to the content area, then check if everything still fits. If not, remove the last item and start a new page. The browser handles all the complex layout calculations - text wrapping, margins, spacing - and you just measure the final result.

This approach works with any content type because you're not trying to predict layout behavior. Whether it's a complex table, multiline text, or mixed content, the browser renders it correctly and tells you exactly how much space it takes.

All content gets preprocessed into complete elements before rendering. For the pick lists, each table row becomes a separate element in the array. Tables get restructured and grouped, text gets formatted - everything becomes complete units that either fit on a page or move to the next page as a whole. No element needs splitting logic during page layout.

Performance is solid: 3-4 seconds for a 6-page PDF with hundreds of data points. Not lightning fast, but completely acceptable for production use with only one process running.

## The Problem with Traditional Libraries

Traditional PDF libraries like jsPDF and PDFKit use absolute positioning - every element needs exact x and y coordinates. For variable content lengths, this means manual calculations: How tall is this text block? Where should the next element go? What if this table has 3 rows versus 30?

Plus, you're stuck with basic styling. I wanted full CSS support - flexbox, grid, modern browser features - and component-based development patterns.

My approach flips both problems: let the browser handle layout and styling naturally, then measure the results. Whether it's 3 warehouse items or 300, the browser renders normally and I just check "does this fit?"

## From Frustration to Production

What started as my frustration with printing my CV has become a production system generating hundreds of warehouse pick lists daily. The PDFs integrate seamlessly into the customer's printing pipeline, and warehouse staff get professional documents they can actually use.

![PDF Example]($assets/dynamic-pdf-generation-puppeteer.png)

**When This Approach Makes Sense:**

This browser-based measurement approach shines when you have:

- **Variable content lengths** - documents that could be 1 page or 10 pages depending on data
- **Complex layouts** - tables, headers, mixed content that needs proper styling
- **Component-based thinking** - you want to use modern web development patterns
- **Full CSS control** - flexbox, grid, custom properties, responsive design principles

**When to Use Something Else:**

For simple text documents with minimal styling, this approach adds unnecessary complexity. Basic web printing or simpler PDF tools will work fine when you don't need dynamic page breaks or complex layouts.

The sweet spot is data-driven documents with unpredictable content lengths and complex styling requirements - exactly what traditional PDF libraries struggle with.

**The Bottom Line:**

This approach eliminates the manual positioning and layout calculations that make traditional PDF libraries painful for variable content. No more predicting text heights or managing overflow scenarios.

**Need help with complex PDF generation?** I've solved these challenges for production systems and can help you avoid the common pitfalls. Whether it's variable-length documents, complex layouts, or migration from existing PDF tools - let's talk about your specific requirements.
