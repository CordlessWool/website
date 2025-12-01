<script>
    import { cn } from "../../lib/cn.js";
    let { tags, ...props } = $props();
</script>

<ul {...props} class={cn("flex flex-wrap gap-3 list-none m-0", props.class)}>
    {#each tags as tag}
        <li class={cn("py-1 px-3 border-2 border-zinc-500 rounded-md")}>
            {tag}
        </li>
    {/each}
</ul>
