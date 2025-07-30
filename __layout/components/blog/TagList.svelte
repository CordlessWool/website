<script>
    let { tags, ...props } = $props();
</script>

<ul {...props}>
    {#each tags as tag}
        <li>
            {tag}
        </li>
    {/each}
</ul>

<style lang="postcss">
    @reference "tailwindcss";
    ul {
        @apply flex flex-wrap gap-3 list-none m-0;
    }

    li {
        @apply py-1 px-3 border-2 border-zinc-500 rounded-md;
    }
</style>
