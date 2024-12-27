<script lang="ts">
    type Props = {
        snipped: string;
        delay?: number;
        onlyChanges?: boolean;
        ontyped?: () => void;
        ontyping?: () => void;
        showCursor?: boolean;
        html?: boolean;
    };
    const {
        snipped,
        delay = 100,
        onlyChanges,
        ontyped,
        ontyping,
        showCursor = true,
        html = false,
    }: Props = $props();

    let firstRendered = !onlyChanges;
    let content = $state("");

    const setTyped = (text: string, cursor: number) => {
        if (firstRendered) {
            firstRendered = false;
            content = text;
        }
        content = text.slice(0, cursor);
        if (content === snipped) {
            ontyped?.();
        } else {
            ontyping?.();
        }
    };

    setTyped(snipped, snipped.length);

    const typing = (snipped: string) => {
        const interval = setInterval(() => {
            let cursor = content.length;
            const tagstack: string[] = [];

            if (!snipped.startsWith(content)) {
                cursor -= 1;
                setTyped(content, cursor);
            } else if (content !== snipped) {
                cursor = cursor + 1;
                setTyped(snipped, cursor);
            } else {
                clearInterval(interval);
                //ontyped?.();
            }
        }, delay);

        return interval;
    };

    $effect(() => {
        if (firstRendered) {
            setTyped(snipped, 0);
        }
        const interval = typing(snipped);
        return () => clearInterval(interval);
    });
</script>

<span>{content}</span><span
    class="animate-pulse bg-zinc-700 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-800"
    >&nbsp;</span
>
