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

<aside class="author-bio">
    <div class="author-info">
        <span class="author-name">{author.name}</span>
        <span class="author-title">
            {author.title}
        </span>
        <p class="author-description">
            {author.description}
        </p>
    </div>
    <div class="author-photo">
        <Image
            fetchpriority="low"
            class="rounded-full border-4 shadow-lg shadow-zinc-400 border-teal-500 border-solid"
            sizes="192px"
            height="256 "
            width="256"
            images={author.photo}
            alt={author.name}
        />
    </div>
</aside>

<style lang="postcss">
    @reference 'tailwindcss';
    .author-bio {
        @apply grid max-w-2xl grid-cols-1 md:grid-cols-3 gap-5 mx-auto my-23 justify-items-center items-center;
    }

    .author-title {
        @apply block text-lg font-bold my-1 text-zinc-600;
    }

    :global(.dark) .author-title {
        @apply text-zinc-400;
    }

    .author-photo {
        @apply max-w-51 max-md:order-first;
    }

    .author-info {
        @apply h-min text-center md:col-span-2;
    }

    .author-name {
        @apply block text-3xl font-bold my-1;
    }

    .author-description {
        @apply text-base;
    }
</style>
