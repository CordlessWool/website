<script>
    import Base from "./components/Base.svelte";
    import { TimelineMain, TimelineMinor } from "./components/blog";
    import BlogPostTile from "./components/BlogPostTile.svelte";
    import IntroText from "./components/IntroText.svelte";
    import { TimeItem, Timeline } from "./components/timeline";

    const { data, children } = $props();
</script>

<Base {data}>
    <main>
        <IntroText {children} />
        <Timeline>
            {#each data.posts as post}
                <TimeItem time={post.published} format={data.format.date}>
                    <TimelineMain {post} />
                    {#snippet minor()}
                        <TimelineMinor {post} />
                    {/snippet}
                </TimeItem>
            {/each}
        </Timeline>
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
