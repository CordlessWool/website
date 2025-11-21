<script lang="ts">
    import { Image } from "@embodi/image/client";
    import * as m from "../../lib/paraglide/messages.js";
    import type { HTMLAttributes } from "svelte/elements";

    type Props = {
        author: {
            name: string;
            title: string;
            photo: string;
        };
    } & HTMLAttributes<HTMLDivElement>;

    const { author, ...props }: Props = $props();
</script>

<aside {...props}>
    <div class="author-photo">
        <Image
            fetchpriority="low"
            class="rounded-full border-2 shadow-md shadow-zinc-400 border-teal-500 border-solid"
            sizes="92px"
            height="256 "
            width="256"
            images={author.photo}
            alt={author.name}
        />
    </div>
    <div class="author-info">
        <dt class="author-type">{m.author()}</dt>
        <dd class="author-name">{author.name}</dd>
        <dd class="author-title">
            {author.title}
        </dd>
    </div>
</aside>

<style lang="postcss">
    @reference 'tailwindcss';

    aside {
        @apply grid w-max mx-auto my-5 px-3 gap-3 items-center leading-none;
        grid-template-columns: auto 1fr;
    }

    .author-type {
        @apply uppercase text-xs leading-none text-zinc-600 font-bold;
    }

    :global(.dark) .author-type {
        @apply text-zinc-400;
    }

    .author-photo {
        @apply max-w-21;
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
    }

    .author-info {
        @apply h-min grid grid-cols-1;
    }

    .author-name {
        @apply text-xl font-bold;
    }

    .author-title {
        @apply text-sm  leading-none;
    }
</style>
