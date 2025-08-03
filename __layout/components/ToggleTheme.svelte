<script lang="ts">
    import type { Action } from "svelte/action";
    import { THEME, themeStore } from "$layout-internal/lib/theme";
    import * as m from "../lib/paraglide/messages.js";
    import { Moon, Sun } from "@lucide/svelte";

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

<button
    class="button"
    aria-label="button"
    title={m.switch_theme()}
    use:darkLightModeAction
>
    <Moon class="dark:hidden block" />
    <Sun class="dark:block hidden" />
</button>
