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
        <a class="!text-zinc-500 dark:!text-zinc-400 text-md" href="/{data.locale}/blog"><ChevronLeft class="inline" />{m.blog_post_overview()}</a>
        <header class="mb-11 pb-3 border-b-2 border-zinc-300 dark:border-zinc-600">
            <h1 class="!mb-0">{data.title}</h1>
            <p class="publish-date !mt-0">Published on: {formatDate(data.published)}</p>
        </header>
        {#if data.updated}
            <p class="update-date">Updated on: {formatDate(data.updated)}</p>
        {/if}
        <article class="blog-post markdown">
            {@render children()}
        </article>
    </main>
</Base>
