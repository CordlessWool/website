<script lang="ts">
    import type { ChangeEventHandler } from "svelte/elements";
    import { getTimeContext } from "./context.svelte";

    let {
        options,
        onchange,
    }: {
        options: [string, string][];
        onchange: (list: string[]) => unknown;
    } = $props();

    let selected: string[] = $state([]);

    let { filter } = getTimeContext();

    const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return;
        }

        if (element.checked) {
            selected.push(element.name);
        } else {
            selected = selected.filter((s) => s !== element.name);
        }
        onchange?.(selected);
        $filter = selected;
        console.log(filter);
    };

    const safeId = (str: string) =>
        str
            .toLowerCase()
            .trim()
            .replaceAll(" ", "-")
            .replace(/[^a-z0-9\-_]/g, "");

    const getId = (str: string) => `timelinefilter-${safeId(str)}`;
</script>

<ul>
    {#each options as option}
        {@const id = getId(option[0])}
        <li>
            <input
                {id}
                hidden
                type="checkbox"
                onchange={onInputChange}
                name={option[0]}
            />
            <label for={id}>
                {option[1]}
            </label>
        </li>
    {/each}
</ul>

<style lang="postcss">
    @reference "tailwindcss/theme";

    ul {
        @apply flex gap-3;
    }

    input:checked + label {
    }

    label {
        @apply cursor-pointer;
        @apply py-1 px-3 text-center block border-2 border-solid rounded-md border-teal-500;
        &:focus {
            @apply outline-none border-dotted;
        }
    }

    label:hover {
        @apply bg-teal-400;
    }
    input:checked + label {
        @apply border-teal-300 text-zinc-500;
    }

    :global(.dark) {
        label {
            @apply border-teal-500;
        }

        label:hover {
            @apply bg-teal-900;
        }
        input:checked + label {
            @apply border-teal-700 text-zinc-500;
        }
    }
</style>
