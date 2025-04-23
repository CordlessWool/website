<script lang="ts">
    import type { Snippet } from "svelte";
    import { CheckCheck } from 'lucide-svelte';

    type Props = {
        time:
            | Date
            | {
                  start: Date;
                  end: Date;
              };
        children: Snippet;
    };

    let { time, children }: Props = $props();
</script>

<li>
    <hr />
    <div class="icon">
        <CheckCheck />
    </div>
    <time>
        {time.toString()}
    </time>
    <div class="con">
        {@render children()}
    </div>
    <hr />
</li>

<style lang="postcss">
    @reference "tailwindcss/theme";
    li {
        @apply grid items-center content-center gap-x-3;
        grid-template: auto auto 1fr / 1fr auto 1fr;
    }



    div.icon {
        @apply col-start-2 row-start-2 row-span-1 justify-self-center;
        @apply border-2 rounded-full p-1 ;
    }

    time {
        @apply row-start-2 col-start-3;
    }

    div.con {
        @apply col-start-3 row-start-3;
    }

    li:nth-child(even) {
        @apply text-right;
        time {
            @apply col-start-1;
        }
        div.con {
            @apply col-start-1;
        }
    }


    hr {
        @apply block h-full w-1 border-2;
        @apply col-start-2 justify-self-center;

        &:first-child {
            @apply row-start-1;
        }

        &:last-child {
            @apply row-start-3;
        }


    }

    li:first-child hr:first-child {
        @apply hidden border-0;
    }

    li:last-child hr:last-child {
        display: none;
    }

</style>
