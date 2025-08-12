<script>
    import { onMount } from "svelte";

    let status = false;

    onMount(() => {
        localStorage.setItem("umami.disabled", 1);
        status = localStorage.getItem("umami.disabled") === "1";
    });
</script>

{#if status}
    <div class="donottrack">
        <p>Umami tracking is disabled.</p>
    </div>
{/if}
