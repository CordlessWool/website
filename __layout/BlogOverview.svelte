<script>
    import Base from "./components/Base.svelte";
    import BlogPostTile from "./components/BlogPostTile.svelte";
    import IntroText from "./components/IntroText.svelte";

    const { data, children } = $props();
</script>

<Base {data}>
    <main>
        <IntroText {children} />
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
        @apply mx-auto max-w-7xl;
    }
    ul {
        @apply grid lg:grid-cols-2 gap-4;
    }
</style>
