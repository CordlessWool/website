<script lang="ts">
    import { Meta, Item } from "./meta";
    import * as m from "../lib/paraglide/messages.js";

    let { project } = $props();

    const compareNames = (a: string, b: string) => {
        return a.toLowerCase() === b.toLowerCase();
    };
</script>

<div class="flex flex-row-reverse items-center">
    <div class="flex flex-col gap-5 mx-3">
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

    <Meta class="grow text-left">
        {#each ["languages", "frameworks", "databases", "tools", "roles", "other"] as key}
            {#if Object.hasOwnProperty.call(project, key)}
                <Item label={m[key]()} content={project[key]} />
            {/if}
        {/each}
    </Meta>
</div>
