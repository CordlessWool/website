<script lang="ts">
    import type { Snippet } from "svelte";

  type Props = {
    class: string;
    price?: string;
    actions?: Snippet
    children: Snippet;
  }

  const { actions, children, price, ...props }: Props = $props();
</script>

<section class="markdown {props.class}">
    <div>
    {@render children()}
    </div>
    {#if price}
        <div class="price">
            <span>{price}</span></div>
    {/if}
    {@render actions?.()}
</section>

<style lang="postcss">
    section {
        @apply grid;
        grid-template-rows: 1fr auto;
        @apply rounded-md border-2 border-solid px-3 py-7;
    }

    div.price {
        @apply text-2xl font-bold text-right;
        @apply my-3 mx-7;
    }

    section :global(h1),
    section :global(h2),
    section :global(h3){
        @apply mt-3;
    }

</style>
