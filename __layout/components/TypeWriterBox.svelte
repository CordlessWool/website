<script lang="ts">
    import { TypeWriter } from "../lib/typewriter/typewriter";
    import { t } from "i18next";

    type Props = {
        html: string;
        maxChars?: number;
    };

    const { html, maxChars = 333 }: Props = $props();

    const shortHTML = (text: string) => {
        // const p = text.indexOf("</p>");
        // const br = text.indexOf("<br/>");
        // console.log(p, br);
        // if (br === -1 && p === -1) {
        //     return text;
        // } else if (br > p || br === -1) {
        //     return text.slice(0, p + 5);
        // } else if (p > br || p === -1) {
        //     return text.slice(0, br + 6);
        // }
    };

    let typeWriter = new TypeWriter(html, { delay: 0, variety: 30 });

    $effect(() => {
        typeWriter.removeWithSave(maxChars - html.length, true);
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
    <button class="write-more" onclick={typeMore}>{t("write_more")}</button>
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
