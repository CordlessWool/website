<script>
    import * as m from "../lib/paraglide/messages.js";
    import TypeWriterMarkdown from "./TypeWriterMarkdown.svelte";

    const { url, title, description, published, updated, format } = $props();

    const formatDate = (date) => {
        date = new Date(date);
        return date.toLocaleDateString(format.date.locale, format.date.options);
    };
</script>

<li
    class="py-4 border rounded-lg p-4 hover:border-teal-500 hover:shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/25 hover:ring-2 hover:ring-teal-500 transition duration-300 cursor-pointer"
>
    <a href={url} class="no-underline text-current">
        <div class="flex flex-col">
            <h2 class="text-lg font-bold mb-2 !mt-0">{title}</h2>
            <p class="mb-4">{description}</p>
            <div class="text-sm text-zinc-500 dark:text-zinc-400">
                <span>Published: {formatDate(published)}</span>
                {#if updated}
                    <span class="ml-4">Updated: {formatDate(updated)}</span>
                {/if}
            </div>
        </div>
    </a>
</li>
