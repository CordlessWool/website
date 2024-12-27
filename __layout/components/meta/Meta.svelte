<script lang="ts">
    const { children } = $props();
</script>

<dl class="meta">
    {@render children()}
</dl>


<style lang="postcss">
    dl.meta {
        @apply grid grid-flow-row grid-cols-2 lg:grid-cols-3 gap-5 sm:text-nowrap my-14;
    }
    </style>
