<script lang="ts">
    import { initTimeContext } from "./context.svelte";

    let { children } = $props();

    initTimeContext();
</script>

<ol>
    {@render children()}
</ol>

<style lang="postcss">
    @reference "tailwindcss/theme";

</style>
