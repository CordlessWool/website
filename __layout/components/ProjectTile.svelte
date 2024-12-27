<script module lang="ts">
  export type Project = {
    name: string;
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

  export type Format = {
    date: {
      locale: string;
      options: Intl.DateTimeFormatOptions;
    };
  };
</script>

<script lang="ts">
    import * as m from "../lib/paraglide/messages.js";
    import TypeWriterMarkdown from './TypeWriterMarkdown.svelte'

    type Props = {
        project: Project;
        format: Format;
    };

    const { project, format }: Props = $props();

    const formatDate = (date: Date | string) => {
        date = new Date(date);
        return date.toLocaleDateString(format.date.locale, format.date.options);
    };

    const compareNames = (a: string, b: string) => {
        return a.toLowerCase() === b.toLowerCase();
    };
</script>

<section class="my-7 py-3 grid grid-flow-row">
    <header class="mb-3">
        <div class="flow items-center">
            <h2 class="m-0 inline-block">{project.name}</h2>
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
        {#if project.end}
            <small
                >{formatDate(project.start || project.date)} - {formatDate(project.end)}</small
            >
        {:else}
            <small
                >{m.since()}
                {formatDate(project.start || project.date)}</small
            >
        {/if}
    </header>
    <div class="markdown mb-7">
        <TypeWriterMarkdown html={project.html} remove={project.typewriter?.['remove-letters']}/>
    </div>
    <div
        class="grid gap-y-7 sm:grid-cols-[1fr_auto] content-center items-center"
    >
        <small class="grow">
            <ul>
                {#each ["languages", "frameworks", "databases", "tools", "roles", "other"] as key}
                    {#if Object.hasOwnProperty.call(project, key)}
                        <li class="grid grid-cols-[auto_1fr] gap-1 items-start">
                            <span class="auto-cols-fr">{ m[key]() }:</span>
                            <ul class="flex flex-row flex-wrap gap-x-1">
                                {#each project[key] as item}
                                    <li
                                        class="after:content-[','] last-of-type:after:content-[''] text-nowrap"
                                    >
                                        {item}
                                    </li>
                                {/each}
                            </ul>
                        </li>
                    {/if}
                {/each}
            </ul>
        </small>
        {#if project.links}
            <div class="flex gap-4 sm:justify-self-end sm:mr-7">
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
        {/if}
    </div>
</section>
