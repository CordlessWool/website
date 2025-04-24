<script lang="ts">
    import { Meta, Item } from "../meta";
    import * as m from "../../lib/paraglide/messages.js";
    import type { SvelteComponent } from "svelte/elements";

    type Props = {
        project: unknown;
    } & SvelteComponent<Meta>;

    let { project, ...props }: Props = $props();
</script>

<Meta {...props} class="grow text-left {props.class}">
    {#each ["languages", "frameworks", "databases", "tools", "roles", "other"] as key}
        {#if Object.hasOwnProperty.call(project, key)}
            <Item label={m[key]()} content={project[key]} />
        {/if}
    {/each}
</Meta>
