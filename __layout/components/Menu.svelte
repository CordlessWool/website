<script lang="ts">
    import { t } from "i18next";
    import { page } from "$embodi/stores";
    const { locale } = $props();
    let isOpen = $state(false);
</script>

<div class="flex justify-self-end top-0 z-10">
    <button
        onclick={() => (isOpen = !isOpen)}
        class="js relative justify-end md:hidden z-10"
        class:open={isOpen}
        aria-label="Menu Button"
    >
        <div
            class="flex flex-col justify-between w-[1.5rem] h-[1.5rem] transform transition-all duration-300 origin-center"
        >
            <div
                class="bg-zinc-800 dark:bg-zinc-200 h-[3px] w-1/2 rounded transform transition-all duration-300 origin-right delay-75"
            ></div>
            <div class="bg-zinc-800 dark:bg-zinc-200 h-[1px] rounded"></div>
            <div
                class="bg-zinc-800 dark:bg-zinc-200 h-[3px] w-1/2 rounded self-end transform transition-all duration-300 origin-left delay-75"
            ></div>
        </div>
    </button>
    <ul
        class="menu text-xl md:text-base gap-y-7 items-center flex-col md:flex-row md:divide-y-0 absolute justify-center md:justify-end md:relative top-0 right-0 h-full w-full bg-teal-400 dark:bg-teal-600 md:bg-inherit md:dark:bg-inherit"
    >
        {#each [["about", ""], ["projects", "/projects"]] as [text, link]}
            {#if (link === "" && ($page.url === `/${locale}` || $page.url === `/${locale}/`)) || (`/${locale}${link}/` === $page.url && link != "")}
                <li>
                    <span
                        class="relative underline font-bold underline-offset-2 p-2"
                        >{t(text)}</span
                    >
                </li>
            {:else}
                <li class="">
                    <a
                        href="/{locale}{link}/"
                        class="relative hover:underline hover:font-bold focus:underline focus:font-bold underline-offset-2 p-2"
                    >
                        {t(text)}
                    </a>
                </li>
            {/if}
        {/each}
    </ul>
</div>

<style lang="postcss">
    button:not(.open) + .menu {
        @apply hidden md:flex;
    }

    button.open + .menu {
        @apply flex fixed md:relative;
    }

    button.open > div {
        @apply -rotate-45;
    }

    button.open > div > div:first-child,
    button.open > div > div:last-child {
        @apply -rotate-90 h-[1px] -translate-y-[1px];
    }
</style>
