<script lang="ts">
    import Base from "./components/Base.svelte";
    import ProjectTile from "./components/ProjectTile.svelte";
    import type { Snippet } from "svelte";



    type Props = {
        data: {
            locale: string;
            title: string;
            page: string;
            projects: {
                data: {
                    name: string;
                }
            }[];
            [x: string]: unknown;
        }
        children: Snippet
    };

    const { data, children }: Props = $props();
</script>

<Base {data}>
    <main>
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
