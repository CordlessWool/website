<script lang="ts">
    const { children, ...props } = $props();
</script>

<dl {...props}>
    {@render children()}
</dl>


<style lang="postcss">
    @reference "tailwindcss/theme";
    dl {
        @apply grid grid-flow-row grid-cols-2 gap-5 sm:text-nowrap;
    }
</style>
