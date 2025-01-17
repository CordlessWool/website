<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        children: Snippet;
        [x: string]: any;
    };

    const { children, ...props }: Props = $props();
</script>

{#if props.href}
    <a {...props} role="button">
        {@render children()}
    </a>

{:else}
<button
    {...props}
>
    {@render children()}
</button>
{/if}


<style lang="postcss">
    button, a {
        @apply py-3 px-5 text-center block border-2 border-solid rounded-md  hover:bg-teal-500 dark:hover:bg-teal-600 border-teal-400 dark:border-teal-600;
    }
</style>
