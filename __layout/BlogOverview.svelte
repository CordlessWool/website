<script>
    import Base from "./components/Base.svelte";
    import BlogPostTile from "./components/BlogPostTile.svelte";



    const { data, children } = $props();
</script>

<Base {data}>
    <main class="pad max-w-(--breakpoint-lg) mx-auto">
        <div class=" pb-12 ">
            {@render children()}
        </div>
        <ul class="print:divide-y-0">
            {#each data.posts as post}
                <BlogPostTile {...post} format={data.format} />
            {/each}
        </ul>
    </main>
</Base>


<style lang="postcss">
    @reference "tailwindcss/theme";
    main {
        margin: 0 auto;
    }
    li {
        display: block;
        page-break-inside: avoid;
    }

    h2 {
        @apply text-lg;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
</style>
