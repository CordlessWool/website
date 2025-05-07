<script>
    const { children, ...props } = $props();
</script>

<div {...props}>
    {@render children()}
</div>

<style lang="postcss">
    @reference "tailwindcss/theme";
    div {
        @apply max-w-5xl mx-auto pb-7;
    }
</style>
