<script lang="ts">
    import Base from "./components/Base.svelte";
    const { data, children } = $props();
</script>

<Base {data}>
    <main class="markdown">
        {@render children()}
    </main>
</Base>
