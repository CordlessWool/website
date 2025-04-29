<script lang="ts">
    import Base from "./components/Base.svelte";
    import { ChevronLeft } from 'lucide-svelte';
    import Image from 'embodi/Image.svelte';
    import * as m from './lib/paraglide/messages.js'
    const { data, children } = $props();
    const { hero } = data;
    const formatDate = (date) => {
        date = new Date(date);
        return date.toLocaleDateString(data.format.date.locale, data.format.date.options);
    };
</script>

<Base {data}>
    <main>
        <header>
            <a class="flex items-center text-md !text-zinc-600 dark:!text-zinc-400" href="/{data.locale}/blog">
                <ChevronLeft class="mr-2 inline" />{m.blog_post_overview()}
            </a>
            <div class="text-sm text-zinc-600 dark:text-zinc-400 justify-self-end">
                <span>Published on: {formatDate(data.published)}</span>
                {#if data.updated}
                    <span class="update-date">Updated on: {formatDate(data.updated)}</span>
                {/if}
            </div>
              </header>

        <article class="blog-post markdown">
            {#if hero}
                <figure>
                    <Image
                        fetchpriority="high"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        height="2000"
                        width="2000"
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
            {@render children()}
        </article>
    </main>
</Base>

<style lang="postcss">
    @reference 'tailwindcss/theme';

    main {
        @apply flex flex-col items-center justify-center;
        @apply max-w-4xl w-full;
    }



    article {
        @apply max-w-2xl w-full;
    }

    header {
        @apply flex flex-row items-center justify-between flex-wrap;
        @apply text-nowrap w-full;
        @apply mb-5 pb-3 border-b-2 border-zinc-300 dark:border-zinc-600;
    }

    figure {
        @apply relative mb-11;
        max-width: 100vw;
        @media (min-width: 768px) {
            width: calc(100% + (var(--spacing) * 10));
            margin-inline: calc(var(--spacing) * -5);
        }
        @media (min-width: 1024px) {
            width: calc(100% + (var(--spacing) * 80));
            margin-inline: calc(var(--spacing) * -40);
        }
        figcaption, figcaption a {
            @apply absolute bottom-1 right-1 w-max;
            @apply text-sm text-zinc-500 px-1 no-underline;
        }
    }

    .markdown :global(pre) {
        max-width: 100vw;
        @media (min-width: 768px) {
            width: calc(100% + (var(--spacing) * 10));
            margin-inline: calc(var(--spacing) * -5);
        }
        @media (min-width: 1024px) {
            width: calc(100% + (var(--spacing) * 40));
            margin-inline: calc(var(--spacing) * -20);
        }
    }
</style>
