<script lang="ts">
    import Icon from "@iconify/svelte";

    let { project, ...props } = $props();

    const compareNames = (a: string, b: string) => {
        return a.toLowerCase() === b.toLowerCase();
    };
</script>

<div {...props}>
    {#each project.links as link}
        <a
            href={link.link}
            target="_blank"
            rel="external"
            title={link.name}
            class="social-icon"
            data-umami-event="project-link-click"
            data-umami-event-id={link.name}
        >
            {#if link.icon}
                <Icon icon={link.icon} />
            {:else if compareNames(link.name, "github")}
                <Icon icon="simple-icons:github" />
            {:else if compareNames(link.name, "gitlab")}
                <Icon icon="simple-icons:gitlab" />
            {:else if compareNames(link.name, "npm")}
                <Icon icon="simple-icons:npm" />
            {:else if compareNames(link.name, "website")}
                <Icon icon="lucide:house" />
            {/if}
        </a>
    {/each}
</div>

<style lang="postcss">
    @reference "tailwindcss";

    div {
        @apply flex flex-col gap-2 mx-1;
    }

    a {
        @apply text-2xl;
    }
</style>
