<script lang="ts">
    import { initTimeContext } from "./context.svelte";
    type Props = {
        children: any;
        filter?: (item: any) => boolean;
    };

    let { children, filter }: Props = $props();

    initTimeContext();
</script>

{@render filter?.()}
<ol>
    {@render children()}
</ol>

<style lang="postcss">
    @reference "tailwindcss";
    ol {
        @apply mt-7;
    }
</style>
