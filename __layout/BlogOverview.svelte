<script>
    import Base from "./components/Base.svelte";



    const { data, children } = $props();
</script>

<Base {data}>
    <main class="pad max-w-(--breakpoint-lg) mx-auto">
        <div class="border-b-2 pb-12 border-zinc-400">
            {@render children()}
        </div>
        <ul class="divide-y-2 div divide-zinc-400 print:divide-y-0">
            {#each data.posts as item}
                <a href={item.url}>
                    <li class="py-4">
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                    </li>
                </a>
            {/each}
        </ul>
    </main>
</Base>


<style lang="postcss">
    @reference "tailwindcss/theme";
    main {
        margin: 0 auto;
    }
    li {
        display: block;
        page-break-inside: avoid;
    }

    h2 {
        @apply text-lg;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }
</style>
