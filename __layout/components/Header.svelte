<script lang="ts">
    import Menu from "./Menu.svelte";
    import ToggleLang from "./ToggleLang.svelte";
    import ToogleTheme from "./ToggleTheme.svelte";

    const { pageTitle, ref, locale } = $props();
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
    <ul class="flex items-center">
        <li aria-label="button" class="light clickable">
            <ToogleTheme />
        </li>
        <li class="light clickable">
            <ToggleLang {ref} />
        </li>
    </ul>
    <Menu {locale} />
</nav>
