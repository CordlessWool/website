<script lang="ts">
    import Base from "./components/Base.svelte";
    import { TimelineMinor, TimelineMain } from "./components/project";
    import { Timeline, TimeItem } from "./components/timeline";
    import type { Snippet } from "svelte";
    import type { DateFormatDefinition } from "./lib/date";
    import { Wrench, BriefcaseBusiness, CheckCheck, GraduationCap, Check } from 'lucide-svelte';



    type Props = {
        data: {
            locale: string;
            company: string;
            title: string;
            meta: string;
            projects: Project[];
            format: {
                date: DateFormatDefinition
            };
            [x: string]: unknown;
        }
        children: Snippet
    };

    const { data, children }: Props = $props();

    const dateFromProject = (project: { start: Date, end: Date, date: Date }) => {
      const { start, end, date } = project;
      if( end) {
        return { start: start || date, end };
      } else {
        return start || date;
      }
    }
</script>

<Base {data}>
    <main class="max-w-(--breakpoint-2xl) mx-auto">
        <div class="max-w-5xl mx-auto">
            {@render children()}
        </div>
        <Timeline>
            {#each data.projects as item}
                <TimeItem time={dateFromProject(item)} format={data.format.date} >
                    <TimelineMain project={item}/>
                    {#snippet minor()}
                        <TimelineMinor project={item} />
                    {/snippet}
                    {#snippet icon()}
                        {#if item.type === 'work' || item.type === 'business'}
                            <BriefcaseBusiness />
                        {:else if item.type === 'study'}
                            <GraduationCap />
                        {:else if item.end}
                            <CheckCheck />
                        {:else if item.released}
                            <Check />
                        {:else}
                            <Wrench />
                        {/if}

                    {/snippet}
                </TimeItem>
            {/each}
        </Timeline>
    </main>
</Base>


<style lang="postcss">
    @reference "tailwindcss/theme";
    main {
        @apply mx-auto;
    }
</style>
