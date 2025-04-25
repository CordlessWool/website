<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  type Props = {
    children: () => any;
  } & HTMLAttributes<HTMLDListElement>;

    const { children, ...props }: Props = $props();
</script>

<dl {...props}>
    {@render children()}
</dl>


<style lang="postcss">
    @reference "tailwindcss/theme";
    dl {
        @apply grid grid-flow-row gap-3 grid-cols-2 sm:text-nowrap;
    }
</style>
