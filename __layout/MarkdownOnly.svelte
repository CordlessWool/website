<script lang="ts">
    import Base from "./components/Base.svelte";
    const { data, children } = $props();
</script>

<Base {data}>
    <main class="markdown max-w-4xl w-full">
        {@render children()}
    </main>
</Base>
