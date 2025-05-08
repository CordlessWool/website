<script lang="ts">
    import type { Snippet } from "svelte";
    import { CheckCheck } from '@lucide/svelte';
    import type { DateFormatDefinition } from "__layout/lib/date";
    import { getTimeContext } from "./context.svelte";

    type Props = {
        time:
            | Date
            | {
                  start: Date;
                  end: Date;
              };
        format: DateFormatDefinition;
        children: Snippet;
        minor?: Snippet;
        icon?: Snippet;
        category?: string[] | string;
    };

    let { time, format, children, minor, category, icon }: Props = $props();

    let { filter } = getTimeContext();

    const formatDate = (date: Date | string | { start: Date, end: Date }): string => {
      if(typeof date === 'string' || date instanceof Date) {
        date = new Date(date);
        return date.toLocaleDateString(format.locale, format.options);
      } else {
        return `${formatDate(date.start)} - ${formatDate(date.end)}`
      }
    }

    const isDisabled = (filter: string[]) => {
      if(typeof category === 'string') {
        return filter.includes(category);
      } else if(Array.isArray(category)) {
        return category.every((d) => filter.includes(d))
      }
    }

</script>

<li class="timeline-item" class:dis={isDisabled($filter)}>
    <hr />
    <div class="icon">
        {#if icon}
            {@render icon()}
        {:else}
            <CheckCheck />
        {/if}
    </div>
    <time>
        {formatDate(time)}
    </time>
    <div class="main">
        {@render children()}
    </div>
    {#if minor}
    <div class="minor">
        {@render minor()}
    </div>
    {/if}
    <hr />
</li>

<style lang="postcss">
    @reference "tailwindcss/theme";
    li {
        @apply grid items-center content-center;
        grid-template: auto auto auto auto / 0 auto 1fr;
        @media ( min-width: 768px ) {
            grid-template: auto auto auto auto / 1fr auto 1fr;
        }

        &.dis {
            @apply opacity-30;
        }

    }


    div.icon {
        @apply col-start-2 row-start-2 row-span-1 justify-self-center;
        @apply border-2 rounded-full p-1;

        :global(svg) {
            @apply max-md:w-5 max-md:h-5;

        }

    }

    time {
        @apply row-start-2 col-start-3;
    }

    div.main, div.minor, time {
        @apply mx-1 md:mx-3;
    }

    div.main {
        @apply col-start-3 row-start-3 self-start;
    }


    div.minor {
        @apply col-start-3 row-start-4 justify-end-safe text-right;
        :global(.direct) {
        direction: rtl;
        }

    }

    @media ( min-width: 768px ) {
        div.minor {
            @apply col-start-1 row-start-3 justify-end-safe text-right;
        }
        li:nth-child(even) {
            @apply text-right;

            time {
                @apply col-start-1;
            }
            div.main {
                @apply col-start-1;
                :global(.direct) {
                 direction: rtl;
                }
            }
            div.minor {
                @apply col-start-3 text-left;
                :global(.direct) {
                direction: ltr;
                }
            }


        }
    }



    hr {
        @apply block h-full w-1 border-2;
        @apply col-start-2 justify-self-center;

        &:first-child {
            @apply row-start-1 h-11;
        }

        &:last-child {
            @apply row-start-3 row-span-2;
        }


    }

    li:first-of-type hr:first-child {
        @apply hidden border-0;
    }

    li:last-child hr:last-child {
        display: none;
    }

</style>
