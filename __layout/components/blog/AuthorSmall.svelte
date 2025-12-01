<script lang="ts">
    import { Image } from "@embodi/image/client";
    import * as m from "../../lib/paraglide/messages.js";
    import type { HTMLAttributes } from "svelte/elements";
    import { cn } from "../../lib/cn.js";

    type Props = {
        author: {
            name: string;
            title: string;
            photo: string;
        };
    } & HTMLAttributes<HTMLElement>;

    const { author, ...props }: Props = $props();
</script>

<address
    {...props}
    class={cn(
        "grid grid-cols-[auto_1fr] w-max gap-3 items-center leading-none not-italic",
        props.class,
    )}
>
    <div class="aspect-square h-auto w-24">
        <Image
            fetchpriority="low"
            loading="lazy"
            class="-scale-x-100 aspect-square h-auto w-full rounded-full border-2 shadow-md shadow-zinc-400 dark:shadow-zinc-600 border-teal-500 border-solid"
            sizes="96px"
            height="256 "
            width="256"
            images={author.photo}
            alt={author.name}
        />
    </div>
    <dl class="h-min grid grid-cols-1">
        <dt
            class="uppercase text-xs leading-none text-zinc-600 font-bold dark:text-zinc-400"
        >
            {m.author()}
        </dt>
        <dd class="text-xl font-bold">{author.name}</dd>
        <dd class="text-sm leading-none">
            {author.title}
        </dd>
    </dl>
</address>
