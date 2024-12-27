<script lang="ts">
    import Button from "./Button.svelte";
    import { getCalApi } from "@calcom/embed-react";
    import { onMount } from "svelte";

    onMount(async () => {
        const cal = await getCalApi({
            namespace: "berlin-based-lead-software-engineer",
        });
        cal("ui", { hideEventTypeDetails: true, layout: "month_view" });
    });
</script>

<Button
    data-cal-namespace="berlin-based-lead-software-engineer"
    data-cal-link="drop-a-note/berlin-based-lead-software-engineer"
    data-cal-config={{ layout: "month_view" }}>Schedual a call</Button
>
