<script lang="ts">
    import Button from "../Button.svelte";
    import * as m from "../../lib/paraglide/messages.js";

    type Props = {
        post: {
            title: string;
            url: string;
            description: string;
        };
    };

    const { post }: Props = $props();
</script>

<section class="grid grid-flow-row mb-5">
    <a href={post.url}>
        <header class="mb-5 block">
            <div class="items-center">
                <h2 class="!m-0">{post.title}</h2>
            </div>
        </header>
        <div class="mb-5">
            {post.description}
        </div>
    </a>
    <div class="flex flex-row direct">
        <Button class="w-max" small href={post.url}>{m.read()}</Button>
    </div>
</section>

<style lang="postcss">
    @reference "tailwindcss/theme";

    span {
        @apply text-xl;
    }
</style>
