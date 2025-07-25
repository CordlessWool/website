<script lang="ts">
    import Base from "./components/Base.svelte";
    import { ChevronLeft } from '@lucide/svelte';
    import Image from 'embodi/Image.svelte';
    import * as m from './lib/paraglide/messages.js'
    import { TagList, Author } from "./components/blog/index.js";
    const { data, children } = $props();
    const { hero } = data;
    const formatDate = (_date: string) => {
        const date = new Date(_date);
        return date.toLocaleDateString(data.format.date.locale, data.format.date.options);
    };
</script>

<svelte:head>
    <!-- Open Graph (für LinkedIn, Facebook, etc.) -->
    <meta property="og:title" content={data.title} />
    <meta property="og:description" content={data.description} />
    {#if hero}
        <meta property="og:image" content={hero.image[0].src} />
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
                {#if hero}
                    <figure class="hero">
                        <Image
                            fetchpriority="high"
                            sizes="(max-width: 1200px) 100vw"
                            width="1200"
                            hight="700"
                            images={ hero.image }
                            alt={ hero.alt }
                        />
                        {#if hero.photographer_link}
                            <figcaption><a href={hero.photographer_link} rel="noopener noreferrer" target="_blank" >{hero.photographer}</a></figcaption>
                        {:else if hero.photographer}
                            <figcaption>{hero.photographer}</figcaption>
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
    @reference 'tailwindcss/theme';

    main {
        @apply flex flex-col items-center justify-center;
        @apply max-w-7xl w-full m-auto p-0;
    }

    article {
        @apply w-full mx-2;

        :global .toc {
            @apply max-lg:hidden;
        }
    }

    .blog-post {
        @apply max-w-2xl w-full m-auto;
    }

    .hero {
        @apply max-w-5xl w-full m-auto;
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

    figure {
        :global(img) {
            @apply object-cover;
            @apply max-h-[37vh];
        }
        @apply relative mb-7 mt-3 max-w-screen ;
        @apply object-cover;

        figcaption, figcaption a {
            @apply absolute bottom-1 right-1 w-max;
            @apply text-sm text-zinc-500 px-1 no-underline;
        }
    }

    .markdown :global(figure) {
        /* max-width: 100vw; */
        @media (min-width: 768px) {
            width: calc(100% + (var(--spacing) * 10));
            margin-inline: calc(var(--spacing) * -5);
        }
        @media (min-width: 1024px) {
            width: calc(100% + (var(--spacing) * 20));
            margin-inline: calc(var(--spacing) * -10);
        }
    }
</style>
