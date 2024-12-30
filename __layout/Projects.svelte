<script lang="ts">
    import Base from "./components/Base.svelte";
    import ProjectTile, {type Project, type Format} from "./components/ProjectTile.svelte";
    import type { Snippet } from "svelte";



    type Props = {
        data: {
            locale: string;
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
    <main class="pad max-w-screen-lg mx-auto">
        <div class="border-b-2 pb-12 border-zinc-400">
            {@render children()}
        </div>
        <ul class="divide-y-2 div divide-zinc-400 print:divide-y-0">
            {#each data.projects as item}
                <li class="py-4">
                    <ProjectTile project={item} format={data.format} />
                </li>
            {/each}
        </ul>
    </main>
</Base>
