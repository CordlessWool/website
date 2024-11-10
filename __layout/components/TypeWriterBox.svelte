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

    let snipped = $state(html);
    let typeWriter = new TypeWriter(html, { delay: 0, variety: 30 });
    typeWriter.subscribe((html) => (snipped = html));

    $effect(() => {
        typeWriter.removeWithSave(maxChars - html.length, true);
        typeWriter.removeFocus();
    });

    $effect(() => {
        console.log({ html, snipped });
        console.log(html.length, snipped.length);
    });

    const typeMore = async () => {
        await typeWriter.setFocus().go();
        typeWriter.removeFocus();
    };
</script>

<div class="markdown">
    {@html snipped}
</div>
{#if html !== snipped && !typeWriter.hasFocus}
    <button class="write-more" onclick={typeMore}>{t("write_more")}</button>
{/if}

<style lang="postcss">
    button.write-more {
        @apply inline-block text-sm bg-zinc-300 rounded-lg px-3 hover:bg-zinc-200;
        @apply dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600;
    }
    .markdown :global(.typewriter-cursor) {
        @apply animate-pulse bg-zinc-700 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-800;
    }
</style>
