<script lang="ts">
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
        >
            {#if link.icon}
                <i class="ri-{link.icon} ri-xl"></i>
            {:else if compareNames(link.name, "github")}
                <i class="ri-github-fill ri-xl"></i>
            {:else if compareNames(link.name, "gitlab")}
                <i class="ri-gitlab-fill ri-xl"></i>
            {:else if compareNames(link.name, "npm")}
                <i class="ri-npmjs-fill ri-xl"></i>
            {:else if compareNames(link.name, "website")}
                <i class="ri-global-line ri-xl"></i>
            {/if}
        </a>
    {/each}
</div>

<style lang="postcss">
    @reference "tailwindcss/theme";

    div {
        @apply flex flex-col gap-2 mx-1;
    }
</style>
