<script lang="ts">
    type Props = {
        label: string;
        content?: string | string[];
        children?: Snippet;
    };

    const { label, content, children }: Props = $props();
</script>

<div class:list={Array.isArray(content)}>
    <dt>{label}</dt>
    {#if children}
        <dd>{@render children()}</dd>
    {:else if typeof content === 'string'}
        <dd>{content}</dd>
    {:else}
        {#each content as item}
            <dd>{item}</dd>
        {/each}
    {/if}
</div>

<style lang="postcss">

    div {
        @apply flex flex-wrap gap-x-1 content-start;
    }

    :global(.dark) dt {
        @apply text-zinc-400;
    }

    dt {
        @apply text-xs text-zinc-500 w-full;
    }

    .list dd {
        @apply gap-x-3;
    }

    dd {
        @apply text-sm  text-zinc-700;
        @apply after:content-[',_'] last-of-type:after:content-[''];
    }

    :global(.dark) dd {
        @apply text-zinc-300;
    }
</style>
