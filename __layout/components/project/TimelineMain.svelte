<script module lang="ts">
  export type Project = {
    name?: string;
    title?: string;
    company: string;
    "company-website": string;
    start: Date;
    end: Date;
    date: Date;
    html: string;
    typewriter: {
      "remove-letters": number;
    };
    languages: string[];
    frameworks: string[];
    databases: string[];
    tools: string[];
    roles: string[];
    other: string[];
    links: {
      name: string;
      link: string;
      icon: string;
    }[];
  };
</script>

<script lang="ts">
    import Button from '../Button.svelte';
    import * as m from "../../lib/paraglide/messages.js";

    type Props = {
        project: Project;
    };

    const { project}: Props = $props();

</script>

<section class="grid grid-flow-row mb-5">
    <header class="mb-5 block">
        <div class="items-center">
            <h2 class="!m-0">{project.name || project.title}</h2>
            {#if project["company-website"]}
                <a
                    href={project["company-website"]}
                    target="_blank"
                    rel="external"
                >
                    <span class="light clickable">
                        {project.company}
                    </span>
                </a>
            {:else if project.company}
                <span class="light">{project.company}</span>
            {/if}
        </div>
    </header>
    <div class="markdown ">
        {@html project.html}
    </div>
    {#if project.showPageLink}
        <div class="flex direct">
        <Button class="w-max" small href={project.url}>{m.continue()}</Button>
        </div>
    {/if}
</section>

<style lang="postcss">
    @reference "tailwindcss/theme";

    span {
        @apply text-xl;
    }
</style>
