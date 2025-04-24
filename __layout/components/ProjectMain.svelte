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
</script>

<script lang="ts">
    import TypeWriterMarkdown from './TypeWriterMarkdown.svelte'

    type Props = {
        project: Project;
    };

    const { project}: Props = $props();

</script>

<section class="grid grid-flow-row">
    <header class="mb-5 block">
        <div class="items-center">
            <h2 class="!m-0">{project.name}</h2>
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
    <div class="markdown mb-7 ">
        <TypeWriterMarkdown html={project.html} remove={project.typewriter?.['remove-letters']}/>
    </div>
</section>
