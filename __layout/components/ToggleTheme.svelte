<script lang="ts">
    import type { Action } from "svelte/action";
    import { THEME, themeStore } from "$layout/lib/theme";

    const darkLightModeAction: Action = (node) => {
        const getTheme = () => {
            return document.documentElement.classList.contains("dark")
                ? THEME.DARK
                : THEME.LIGHT;
        };

        const toggle = () => {
            document.documentElement.classList.toggle("dark");
            const theme = getTheme();
            themeStore.set(theme);
            localStorage.theme = theme;
        };

        node.addEventListener("click", toggle);

        const theme = getTheme();
        themeStore.set(theme);
        localStorage.theme = theme;

        $effect(() => {
            return () => {
                node.removeEventListener("click", toggle);
            };
        });
    };
</script>

<svelte:head>
    <script type="text/javascript">
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    </script>
</svelte:head>

<button aria-label="button" use:darkLightModeAction>
    <i class="ri-moon-fill dark:hidden block"></i>
    <i class="ri-sun-fill hidden dark:block"></i>
</button>
