<script>
    import { onMount } from "svelte";

    onMount(() => {
        localStorage.setItem("umami.disabled", 1);
    });
</script>
