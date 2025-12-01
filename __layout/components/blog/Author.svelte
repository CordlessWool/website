<script lang="ts">
    import { Image } from "@embodi/image/client";
    type Props = {
        author: {
            name: string;
            description: string;
            photo: string;
        };
    };

    const { author }: Props = $props();
</script>

<address
    class="grid max-w-2xl grid-cols-1 md:grid-cols-3 gap-5 mx-auto my-23 justify-items-center items-center not-italic"
>
    <div class="h-min text-center md:col-span-2">
        <span class="block text-3xl font-bold my-1">{author.name}</span>
        <span
            class="block text-lg font-bold my-1 text-zinc-600 dark:text-zinc-400"
        >
            {author.title}
        </span>
        <p class="text-base">
            {author.description}
        </p>
    </div>
    <div class="max-w-51 aspect-square h-auto max-md:order-first">
        <Image
            fetchpriority="low"
            loading="lazy"
            class="rounded-full border-4 shadow-lg shadow-zinc-400 dark:shadow-zinc-600 border-teal-500 border-solid"
            sizes="192px"
            height="256 "
            width="256"
            images={author.photo}
            alt={author.name}
        />
    </div>
</address>
