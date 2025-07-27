<script lang="ts">
    import Icon from "@iconify/svelte";
    import type { HTMLAnchorAttributes } from "svelte/elements";

    type Props = {
        icon: string;
    } & HTMLAnchorAttributes;

    let { icon, ...props }: Props = $props();
</script>

<a {...props} class:social-icon={true}>
    <Icon icon="simple-icons:{icon}" />
</a>

<style lang="postcss">
    @reference "tailwindcss";

    a {
        @apply text-2xl;
    }
</style>
