<script lang="ts">
    import type { Action } from "svelte/action";

    const darkLightModeAction: Action = (node) => {
        const toggle = () => {
            document.documentElement.classList.toggle("dark");
            localStorage.theme = document.documentElement.classList.contains(
                "dark",
            )
                ? "dark"
                : "light";
        };

        node.addEventListener("click", toggle);

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
