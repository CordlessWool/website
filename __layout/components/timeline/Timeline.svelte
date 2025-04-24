<script lang="ts">
    let { children } = $props();
</script>

<ul>
    {@render children()}
</ul>

<style lang="postcss">
    @reference "tailwindcss/theme";

</style>
