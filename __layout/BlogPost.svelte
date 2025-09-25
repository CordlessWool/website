<script lang="ts">
    import Base from "./components/Base.svelte";
    import { ChevronLeft } from '@lucide/svelte';
    import { Image } from '@embodi/image/client';
    import * as m from './lib/paraglide/messages.js'
    import { TagList, Author } from "./components/blog/index.js";
    const { data, children } = $props();
    const formatDate = (_date: string) => {
        const date = new Date(_date);
        return date.toLocaleDateString(data.format.date.locale, data.format.date.options);
    };
</script>

<svelte:head>
    <!-- Open Graph (für LinkedIn, Facebook, etc.) -->
    <meta property="og:title" content={data.title} />
    <meta property="og:description" content={data.description} />
    {#if data.hero}
        <meta property="og:image" content={data.hero.image[0].src} />
    {/if}
    <!-- <meta property="og:url" content="https://deine-domain.tld/agile-projekte-scheitern" /> -->
    <meta property="og:type" content="article" />
</svelte:head>

<Base {data}>
    <main>
        <header>
            <a class="flex items-center text-md !text-zinc-700 dark:!text-zinc-300" href="/{data.locale}/blog/">
                <ChevronLeft class="mr-2 inline" />{m.blog_post_overview()}
            </a>
            <div class="grid grid-cols-2 gap-x-2 text-xs text-zinc-600 dark:text-zinc-400 justify-self-end px-2">

                    <span>Published on:</span>
                    <time datetime={data.published}>{formatDate(data.published)}</time>
                {#if data.updatedAt}
                        <span>Updated on:</span>
                        <time datetime={data.updatedAt}>{formatDate(data.updatedAt)}</time>
                {/if}
            </div>

        </header>

        <article>
            <header>
                <TagList class="tag-list" tags={data.tags.filter((tag) => tag !== 'blog')} />
                {#if data.hero}
                    <figure class="hero">
                        <Image
                            fetchpriority="high"
                            sizes="(max-width: 1200px) 100vw"
                            width="1200"
                            hight="700"
                            images={ data.hero.image }
                            alt={ data.hero.alt ?? "" }
                        />
                        {#if data.hero.photographer_link}
                            <figcaption><a href={data.hero.photographer_link} rel="noopener noreferrer" target="_blank" >{data.hero.photographer}</a></figcaption>
                        {:else if data.hero.photographer}
                            <figcaption>{data.hero.photographer}</figcaption>
                        {/if}
                    </figure>
                {/if}
            </header>
            <div class="markdown blog-post">
            {@render children()}
            </div>
            <Author author={data.author} />
        </article>
    </main>
</Base>

<style lang="postcss">
    @reference 'tailwindcss';

    main {
        @apply flex flex-col items-center justify-center;
        @apply max-w-7xl w-full m-auto p-0;
    }

    article {
        @apply w-full mx-2 leading-7;

    }

    .blog-post {
        @apply mx-auto;
        @apply lg:flex lg:flex-row-reverse gap-5;
        :global {
            .content {
                @apply mx-auto px-2 lg:mx-0;
                @apply max-w-2xl;
            }
            .toc {
                @apply max-w-96;
                @apply max-lg:hidden;
                @apply mx-1 my-13;
                @apply self-start sticky top-5;
                > ol {
                    @apply list-none m-0;
                }
                ol {
                    @apply text-zinc-500 ;

                }

                a:not(:hover, :focus) {
                    @apply no-underline text-zinc-600;
                    :global(.dark) & {
                        @apply text-zinc-400;
                    }

                }
            }

            svg[aria-roledescription="quadrantChart"] {
                .labels text, .title text {
                    :global(.dark) & {
                        fill: var(--color-zinc-100);
                    }
                }
            }
            /* Universal Mermaid styling */
            .flowchart {
              background: transparent !important;
              @apply mx-auto my-7;
              font-family: system-ui, -apple-system, sans-serif;
            }

            /* Ensure text is always readable */
            /*.flowchart .node .label text,
            .flowchart .edgeLabel text {
              fill: #1f2937 !important;
              font-weight: 500;
            }*/

            /* Consistent node styling */
            .flowchart .node rect,
            .flowchart .node polygon {
              fill: var(--color-zinc-100) !important;
              stroke: var(--color-zinc-700) !important;
              stroke-width: 1px !important;
              /*rx: 6px !important;
              ry: 6px !important;*/
              filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
            }

            /* Edge styling */
            /*.flowchart .edgePath .path {
              stroke: var(--color-zinc-500) !important;
              stroke-width: 2px !important;
            }*/

            /* Edge labels */

            .flowchart .edgeLabel p  {
                @apply bg-zinc-50!  text-zinc-700!;
                :global(.dark) & {
                    @apply bg-transparent! text-zinc-300!;
                }
            }

            /* Edge labels */
            /*.flowchart .edgeLabel rect {
              fill: #ffffff !important;
              stroke: #e5e7eb !important;
              stroke-width: 2px !important;
              opacity: 0.95 !important;
            }*/
        }



    }

    .hero {

    }


    main > header {
        --margin: calc(var(--spacing) * 7);
        @apply flex flex-row items-center justify-between flex-wrap;
        @apply text-nowrap;
        @apply pb-1 border-b-2 border-zinc-300 dark:border-zinc-600;
        margin-inline: var(--margin);
        width: calc(100% - var(--margin));

    }

    article :global(.tag-list) {
        @apply justify-center my-3;
        @media (max-width: 1024px) {
            @apply justify-center-safe flex-nowrap text-nowrap;
            @apply overflow-x-scroll;
            @apply box-border;

            scrollbar-width: none; /* Firefox */
            &::-webkit-scrollbar {
                display: none;
                width: 0px;
                background: transparent; /* make scrollbar transparent */
            }
        }
    }

    article :global(.extra-wide) {
        @media (min-width: 768px) {
            width: calc(100% + (var(--spacing) * 10));
            margin-inline: calc(var(--spacing) * -5);
        }
        @media (min-width: 1024px) {
            width: calc(100% + (var(--spacing) * 80));
            margin-inline: calc(var(--spacing) * -40);
        }
    }

    figure.hero {
        @apply max-w-5xl w-full m-auto;
        @apply max-h-[37vh];
        @apply overflow-hidden;
        @apply relative my-3 max-w-screen ;
        @apply object-cover;

        :global(img) {
            @apply object-cover;
        }


        figcaption, figcaption a {
            @apply absolute bottom-1 right-1 w-max;
            @apply text-sm text-zinc-500 px-1 no-underline;
        }
    }

    .markdown :global(figure) {

        @media (min-width: 768px) {
            width: calc(100% + (var(--spacing) * 2));
            margin-inline: calc(var(--spacing) * -1);
        }
        @media (min-width: 1280px) {
            width: calc(100% + (var(--spacing) * 6));
            margin-inline: calc(var(--spacing) * -3);
        }
    }
</style>
