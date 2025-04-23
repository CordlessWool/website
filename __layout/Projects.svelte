<script lang="ts">
    import Base from "./components/Base.svelte";
    import ProjectTile, {type Project, type Format} from "./components/ProjectTile.svelte";
    import { Timeline, TimeItem } from "./components/timeline";
    import type { Snippet } from "svelte";



    type Props = {
        data: {
            locale: string;
            company: string;
            title: string;
            meta: string;
            projects: Project[];
            format: Format;
            [x: string]: unknown;
        }
        children: Snippet
    };

    const { data, children }: Props = $props();
</script>

<Base {data}>
    <main class="pad max-w-(--breakpoint-lg) mx-auto">
        <div class="border-b-2 pb-12 border-zinc-400">
            {@render children()}
        </div>
        <Timeline>
            {#each data.projects as item}
                <TimeItem time={item.start || item.date}>
                    <ProjectTile project={item} format={data.format} />
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
