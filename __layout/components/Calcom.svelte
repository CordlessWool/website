<script lang="ts">
    import * as m from "../lib/paraglide/messages";
    import Button from "./Button.svelte";
    import { getCalApi } from "@calcom/embed-react";
    import { onMount } from "svelte";

    onMount(async () => {
        const cal = await getCalApi({
            namespace: "catchup",
            embedJsUrl: "https://cal.dropanote.de/embed/embed.js",
        });
        cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    });
</script>

<Button
    class="w-full"
    data-cal-namespace="catchup"
    data-cal-link="freelance/catchup"
    data-cal-origin="https://cal.dropanote.de"
    data-cal-config={{ layout: "month_view" }}>{m.schedule_call()}</Button
>
