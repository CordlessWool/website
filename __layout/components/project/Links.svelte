<script lang="ts">
    import { SiGithub, SiGitlab, SiNpm } from "@icons-pack/svelte-simple-icons";
    import { ExternalLink } from "@lucide/svelte";

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
            {#if compareNames(link.name, "github")}
                <SiGithub />
            {:else if compareNames(link.name, "gitlab")}
                <SiGitlab />
            {:else if compareNames(link.name, "npm")}
                <SiNpm />
            {:else}
                <ExternalLink />
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
