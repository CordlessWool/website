<script lang="ts">
    import Base from "./components/Base.svelte";
    import { ChevronLeft } from 'lucide-svelte';
    import * as m from './lib/paraglide/messages.js'
    const { data, children } = $props();
    const formatDate = (date) => {
        date = new Date(date);
        return date.toLocaleDateString(data.format.date.locale, data.format.date.options);
    };
</script>

<Base {data}>
    <main>
        <header>
            <a class="flex items-center text-md !text-zinc-500 dark:!text-zinc-400" href="/{data.locale}/blog">
                <ChevronLeft class="mr-2 inline" />{m.blog_post_overview()}
            </a>
            <div class="text-sm text-gray-600 dark:text-gray-400 justify-self-end">
                <span>Published on: {formatDate(data.published)}</span>
                {#if data.updated}
                    <span class="update-date">Updated on: {formatDate(data.updated)}</span>
                {/if}
            </div>

        </header>

        <article class="blog-post markdown">
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
        @apply mb-11 pb-3 border-b-2 border-zinc-300 dark:border-zinc-600;
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
