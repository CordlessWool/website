<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    type Props = {
        children: Snippet;
        small?: true;
    } & (HTMLAttributes<HTMLButtonElement> | HTMLAttributes<HTMLAnchorElement>);

    const { children, small, ...props }: Props = $props();
</script>

{#if props.href}
    <a class:small {...props} role="button">
        {@render children()}
    </a>
{:else}
<button
    class:small
    {...props}
>
    {@render children()}
</button>
{/if}


<style lang="postcss">
    @reference "tailwindcss/theme";
    button, a {
        @apply cursor-pointer;
        @apply py-3 px-5 text-center block border-2 border-solid rounded-md  hover:bg-teal-400 border-teal-500;
    }

    :global(.dark) {
        button, a {
            @apply border-teal-500 hover:bg-teal-900;
        }
    }

    .small {
        @apply py-1 px-3;
    }
</style>
