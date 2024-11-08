<script lang="ts">
    import Menu from "./Menu.svelte";
    import ToggleLang from "./ToggleLang.svelte";
    import ToogleTheme from "./ToggleTheme.svelte";

    const { title, locale, page } = $props();
</script>

<nav class="flex my-3 mb-7 gap-3" aria-label="main navigation">
    <h1 class="text-xl grow font-bold my-3">
        {title}
    </h1>
    <ul class="flex text-xl items-center">
        <li aria-label="button" class="light clickable button">
            <ToogleTheme />
        </li>
        <li class="light clickable button">
            <ToggleLang />
        </li>
    </ul>
    <Menu {locale} {page} />
</nav>
