<script lang="ts">
    let { children } = $props();
</script>

<ol>
    {@render children()}
</ol>

<style lang="postcss">
    @reference "tailwindcss/theme";

</style>
