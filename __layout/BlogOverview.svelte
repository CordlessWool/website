<script>
    import Base from "./components/Base.svelte";
    import { TimelineMain, TimelineMinor } from "./components/blog";
    import BlogPostTile from "./components/BlogPostTile.svelte";
    import IntroText from "./components/IntroText.svelte";
    import { TimeItem, Timeline, Filter } from "./components/timeline";
    import { Blend, Users, Code, Asterisk } from '@lucide/svelte';

    const { data, children } = $props();

</script>

<Base {data}>
    <main>
        <IntroText {children} />
        <Timeline>
            {#snippet filter()}
                <Filter storageId="blogposttimelinefilter" class="max-w-5xl mx-auto" {...data.timefilter} />
            {/snippet}
            {#each data.posts as post (post)}
                <TimeItem time={post.published} format={data.format.date} category={post.category}>
                    <TimelineMain {post} />
                    {#snippet minor()}
                        <TimelineMinor {post} />
                    {/snippet}
                    {#snippet icon()}
                        {#if Array.isArray(post.category)}
                            <Blend />
                        {:else if post.category === 'dev'}
                            <Code />
                        {:else if post.category === 'management'}
                            <Users />
                        {:else}
                            <Asterisk />
                        {/if}
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
