<script lang="ts">
    import Base from "./components/Base.svelte";
    import { ChevronLeft } from '@lucide/svelte';
    import Image from 'embodi/Image.svelte';
    import * as m from './lib/paraglide/messages.js'
    import { TagList, Author } from "./components/blog/index.js";
    const { data, children } = $props();
    const { hero } = data;
    const formatDate = (date) => {
        date = new Date(date);
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
            <a class="flex items-center text-md !text-zinc-600 dark:!text-zinc-400" href="/{data.locale}/blog">
                <ChevronLeft class="mr-2 inline" />{m.blog_post_overview()}
            </a>
            <div class="text-sm text-zinc-600 dark:text-zinc-400 justify-self-end">
                <span>Published on: {formatDate(data.published)}</span>
                {#if data.updated}
                    <span class="update-date">Updated on: {formatDate(data.updatedAt)}</span>
                {/if}
            </div>

        </header>

        <article>
            <header>
                <TagList class="tag-list" tags={data.tags.filter((tag) => tag !== 'blog')} />
                {#if hero}
                    <figure>
                        <Image
                            fetchpriority="high"
                            sizes="(max-width: 768px) 100vw, 1000"
                            width="1000"
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
        @apply max-w-7xl w-full;
    }

    article {
        @apply w-full;
    }

    .blog-post {
        @apply max-w-2xl w-full m-auto;
    }

    main > header {
        @apply flex flex-row items-center justify-between flex-wrap;
        @apply text-nowrap w-full;
        @apply mb-5 pb-3 border-b-2 border-zinc-300 dark:border-zinc-600;

    }

    article :global(.tag-list) {
         @apply justify-center;
        @media (max-width: 1024px) {
            @apply justify-start flex-nowrap text-nowrap;
            @apply overflow-x-auto;

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
        max-width: 100vw;
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
