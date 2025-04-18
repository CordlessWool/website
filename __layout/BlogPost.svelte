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
    <main class="markdown">
                <header class="mb-11 pb-3 border-b-2 border-zinc-300 dark:border-zinc-600 flex flex-col md:flex-row md:items-center md:justify-between">
                    <a class="flex items-center text-md !text-zinc-500 dark:!text-zinc-400" href="/{data.locale}/blog">
                        <ChevronLeft class="mr-2 inline" />{m.blog_post_overview()}
                    </a>
                    <div class="mt-2 md:mt-0 text-sm text-gray-600 dark:text-gray-400">
                        <span>Published on: {formatDate(data.published)}</span>
                    </div>
                </header>
        {#if data.updated}
            <p class="update-date">Updated on: {formatDate(data.updated)}</p>
        {/if}
        <article class="blog-post markdown">
            {@render children()}
        </article>
    </main>
</Base>
