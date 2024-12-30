<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        children: Snippet;
        [x: string]: any;
    };

    const { children, ...props }: Props = $props();
</script>

<button
    {...props}
    class="py-3 px-5 border-2 border-solid rounded-md dark:hover:bg-teal-600 hover:bg-teal-400 border-teal-400 dark:border-teal-600 {props.class ?? ''}"
>
    {@render children()}
</button>
