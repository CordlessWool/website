<script lang="ts">
    import { initTimeContext } from "./context.svelte";

    let { children, filter } = $props();

    initTimeContext();
</script>

{@render filter?.()}
<ol>
    {@render children()}
</ol>

<style lang="postcss">
    @reference "tailwindcss/theme";
    ol {
        @apply mt-7
    }
</style>
