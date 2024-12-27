<script lang="ts">
    import { TypeWriter } from "../lib/typewriter/typewriter";
    import * as m from "../lib/paraglide/messages.js";

    type Props = {
        html: string;
        remove?: number;
    };

    const { html, remove }: Props = $props();

    let typeWriter = new TypeWriter(html, { delay: 0, variety: 30 });

    $effect(() => {
        if (!isNaN(remove)) {
            typeWriter.removeWithSave(-Number(remove));
        }
        typeWriter.removeFocus();
    });

    const typeMore = async () => {
        await typeWriter.setFocus().go();
        typeWriter.removeFocus();
    };
</script>

<div class="markdown">
    {@html $typeWriter}
</div>
{#if html !== $typeWriter && !typeWriter.hasFocus}
    <button class="write-more" onclick={typeMore}>{m.write_more()}</button>
{/if}

<style lang="postcss">
    button.write-more {
        @apply inline-block text-sm bg-zinc-300 rounded-lg px-3 hover:bg-zinc-200;
    }
    :global(.dark) .write-more {
        @apply bg-zinc-700 text-zinc-200 hover:bg-zinc-600;
    }
    .markdown :global(.typewriter-cursor) {
        @apply animate-pulse bg-zinc-700 text-zinc-200;
    }
    .markdown :global(.typewriter-cursor:where(.dark, .dark *)) {
        @apply bg-zinc-300 text-zinc-800;
    }
</style>
