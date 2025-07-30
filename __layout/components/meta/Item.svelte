<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    type Props = {
        label: string;
        content?: string | string[];
        children?: Snippet;
    } & HTMLAttributes<HTMLDivElement>;

    const { label, content, children, ...props }: Props = $props();
</script>

<div {...props} class:list={Array.isArray(content)}>
    <dt>{label}</dt>
    {#if children}
        <dd>{@render children()}</dd>
    {:else if typeof content === 'string'}
        <dd>{content}</dd>
    {:else if Array.isArray(content)}
        {#each content as item}
            <dd>{item}</dd>
        {/each}
    {/if}
</div>

<style lang="postcss">
    @reference "tailwindcss";
    div {
        @apply flex flex-wrap gap-x-1 content-start;
    }

    :global(.dark) dt {
        @apply text-zinc-400;
    }

    dt {
        @apply text-xs text-zinc-600 w-full;
    }

    .list dd {
        @apply gap-x-3;
    }

    dd {
        @apply text-sm  text-zinc-800;
        @apply after:content-[',_'] last-of-type:after:content-[''];
    }

    :global(.dark) dd {
        @apply text-zinc-300;
    }

</style>
