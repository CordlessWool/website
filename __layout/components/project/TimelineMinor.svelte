<script lang="ts">
    import Tech from "./Tech.svelte";
    import Links from "./Links.svelte";

    let { project } = $props();
</script>

<div class="flex flex-row-reverse items-center">
    <Links {project} />
    <Tech {project} />
</div>

<style>
    div {
        direction: ltr;
    }
</style>
