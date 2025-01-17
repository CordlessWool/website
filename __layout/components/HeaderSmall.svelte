<script lang="ts">
    import ToogleTheme from "./ToggleTheme.svelte";

    const { title } = $props();
</script>

<nav
    class="flex my-3 mb-7 gap-3 mx-auto px-1 md:px-3 lg:px-7 max-w-screen-2xl w-full"
    aria-label="main navigation"
>
    <h1 class="text-xl grow font-bold my-3">
        {title}
    </h1>
    <ul class="flex text-xl items-center">
        <li aria-label="button" class="light clickable button">
            <ToogleTheme />
        </li>
    </ul>
</nav>
