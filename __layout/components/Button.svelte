<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAnchorAttributes, HTMLAttributes } from "svelte/elements";

    type Props = ({
        children: Snippet;
        small?: true;
    }
    & HTMLAttributes<HTMLButtonElement>)
    | ({
        children: Snippet;
        small?: true;
    }
    & HTMLAnchorAttributes);

    const { children, small, ...props }: Props = $props();

</script>

{#if props.href}
    <a class:btn={true} class:small {...props} role="button">
        {@render children()}
    </a>
{:else}
<button
    class:btn={true}
    class:small
    {...props}
>
    {@render children()}
</button>
{/if}
