<script lang="ts">
    import { Dot } from "@lucide/svelte";
    import * as m from "../lib/paraglide/messages";
    import Button from "./Button.svelte";
</script>

<Button
    class="w-full"
    href="https://cal.com/drop-a-note/berlin-based-lead-software-engineer"
    target="_blank"
>
    <div class="flex flex-nowrap flex-row items-center justify-center">
        <span>{m.schedule_call()}</span>
        <Dot class="text-zinc-400 dark:text-zinc-600" />
        <span class="text-zinc-400 dark:text-zinc-600">cal.com</span>
    </div>
</Button>
