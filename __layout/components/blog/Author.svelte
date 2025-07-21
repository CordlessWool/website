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
            sizes="(max-width: 256px) 100vw"
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
        @apply grid max-w-3xl gap-5 mx-auto my-23;
        grid-template-columns: 1fr 200px;
    }

    .author-info {
    }

    .author-name {
        @apply block text-3xl font-bold mb-3;
    }

    .author-description {
        @apply text-base;
    }
</style>
