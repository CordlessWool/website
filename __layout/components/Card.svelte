<script lang="ts">
    import type { Snippet } from "svelte";

  type Props = {
    class?: string;
    title?: string;
    sub?: string;
    price?: string;

    actions?: Snippet
    children: Snippet;
  }

  const { actions, children, price, title, sub, ...props }: Props = $props();
</script>

<section {...props} class:border={true}>
    <div class="markdown">
        {#if title}
        <header>

            <h2>{title}</h2>
            {#if sub}
                <small class="text-sm">{sub}</small>
            {/if}
            </header>

        {/if}
    {@render children()}
    </div>
    {#if price}
        <div class="price">
            <span>{price}</span>
        </div>
    {/if}
    {#if actions}
        <div class="action">
            {@render actions()}
        </div>
    {/if}
</section>

<style lang="postcss">
    @reference "tailwindcss";
    section {
        @apply grid gap-7;
        grid-template-rows: 1fr auto;
        @apply rounded-md border-2 border-solid px-5 py-7;
    }

    header {
        @apply mb-5;
    }

    header small {
        @apply block pl-1 italic;
    }

    header h2 {
        @apply pb-0 mb-0;
    }

    div.price {
        @apply text-2xl font-bold text-right;
        @apply my-3 mx-7;
    }

    div.action {
        @apply w-full;
    }


    section :global(h1),
    section :global(h2),
    section :global(h3){
        @apply mt-3;
    }

    .price {
        word-spacing: 0.3rem;
    }


</style>
