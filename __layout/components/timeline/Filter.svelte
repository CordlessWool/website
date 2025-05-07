<script lang="ts">
    import type { ChangeEventHandler } from "svelte/elements";
    import { getTimeContext } from "./context.svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import { onMount } from "svelte";

    let {
        options,
        label,
        onchange,
        storageId,
        ...props
    }: {
        options: [string, string][];
        label: string;
        storageId?: string;
        onchange: (list: string[]) => unknown;
    } & HTMLAttributes<HTMLDivElement> = $props();

    let { filter } = getTimeContext();
    onMount(() => {
        $filter = readStorage();
    });

    const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const element = event.target as HTMLInputElement;
        if (!element) {
            return;
        }

        if (element.checked) {
            filter.update((all) => [...all, element.name]);
        } else {
            $filter = $filter.filter((s) => s !== element.name);
        }
        onchange?.($filter);
        writeStorage($filter);
    };

    const writeStorage = (data: Array<string>) => {
        if (storageId) {
            localStorage.setItem(storageId, JSON.stringify(data));
        }
    };

    const readStorage = (): Array<string> => {
        if (storageId) {
            const str = localStorage.getItem(storageId);
            if (str) {
                return JSON.parse(str);
            }
        }
        return [];
    };

    const safeId = (str: string) =>
        str
            .toLowerCase()
            .trim()
            .replaceAll(" ", "-")
            .replace(/[^a-z0-9\-_]/g, "");

    const getId = (str: string) => `timelinefilter-${safeId(str)}`;
</script>

<div {...props}>
    <span>{label}</span>
    <ul>
        {#each options as option}
            {@const id = getId(option[0])}
            <li>
                <input
                    {id}
                    hidden
                    type="checkbox"
                    checked={$filter.includes(option[0])}
                    onchange={onInputChange}
                    name={option[0]}
                />
                <label for={id}>
                    {option[1]}
                </label>
            </li>
        {/each}
    </ul>
</div>

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
