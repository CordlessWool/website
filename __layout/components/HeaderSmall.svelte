<script lang="ts">
    import ToogleTheme from "./ToggleTheme.svelte";

    const { pageTitle } = $props();
</script>

<nav
    class="flex my-3 mb-7 gap-3 mx-auto px-1 md:px-3 lg:px-7 max-w-(--breakpoint-2xl) w-full"
    aria-label="main navigation"
>
    <div class="text-xl grow font-bold my-3 flex flex-row">
        <img src="/favicon/icon.svg" alt="Logo" class="w-8 h-8" />
        <a href="/{locale}/">
            {pageTitle}
        </a>
    </div>
    <ul class="flex text-xl items-center">
        <li aria-label="button" class="light clickable button">
            <ToogleTheme />
        </li>
    </ul>
</nav>
