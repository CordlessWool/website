<script lang="ts">
    import Image from "embodi/Image.svelte";
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

    .author-photo {
        @apply max-w-48 max-md:order-first;
    }

    .author-info {
        @apply h-min text-center md:col-span-2;
    }

    .author-name {
        @apply block text-3xl font-bold mb-3;
    }

    .author-description {
        @apply text-base;
    }
</style>
