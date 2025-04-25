<script lang="ts">
    import Base from "./components/Base.svelte";
    import { ChevronLeft } from 'lucide-svelte';
    import * as m from './lib/paraglide/messages.js'
    import { Tech, Links } from "./components/project";
    import type { Snippet } from "svelte";
    import { Item, Meta } from "./components/meta/index.js";

    type Props = {
      data: any,
      children: Snippet
    }

    const { data, children }: Props = $props();

    const formatDate = (date: string | Date) => {
        date = new Date(date);
        return date.toLocaleDateString(data.format.date.locale, data.format.date.options);
    };
</script>

<Base {data}>
    <main>
        <header>
            <a class="flex items-center text-md !text-zinc-600 dark:!text-zinc-400" href="/{data.locale}/projects">
                <ChevronLeft class="mr-2 inline" />{m.project_overview()}
            </a>
            <div class="text-sm text-zinc-600 dark:text-zinc-400 justify-self-end">
                <span>Published on: {formatDate(data.date)}</span>
                {#if data.updated}
                    <span class="update-date">Updated on: {formatDate(data.updated)}</span>
                {/if}
            </div>
        </header>
        <article>
            <div class="markdown max-w-xl">
                <h1>{data.title}</h1>
                {@render children()}
            </div>
            <div class="meta">
                <Meta class="lg:!grid-cols-1">
                    {#if data.company}
                    <Item label={m.company()}>
                        {#if data['company-website']}
                            <a class="text-xl link" href={data['company-website']} target="_blank" rel="noopener noreferrer">
                                {data.company}
                            </a>
                        {:else}
                            <span class="text-xl">{data.company}</span>
                        {/if}
                    </Item>
                    {/if}
                    <Item label={m.from()} content={formatDate(data.start ?? data.date)} />
                    {#if data.end}
                        <Item label={m.to()} content={formatDate(data.end)} />
                    {/if}



                </Meta>
                <Tech project={data} class="lg:!grid-cols-1" />
                <Links class="!flex-row" project={data} />
            </div>
        </article>

    </main>
</Base>


<style lang="postcss">
    @reference 'tailwindcss/theme';

    main {
        @apply flex flex-col items-center justify-center;
        @apply max-w-7xl w-full;
    }



    article {
        @apply grid lg:grid-cols-3 lg:gap-7 max-w-5xl mx-auto justify-items-center;

        h1 {
            @apply mt-0;
        }

    }

    .markdown {
        @apply lg:col-span-2;
    }

    .meta {
        @apply lg:sticky lg:top-3 h-max max-w-xl flex flex-col gap-y-5;
    }

    header {
        @apply flex flex-row items-center justify-between flex-wrap;
        @apply text-nowrap w-full;
        @apply mb-11 pb-3 border-b-2 border-zinc-300 dark:border-zinc-600;
    }

</style>
