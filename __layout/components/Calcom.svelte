<script lang="ts">
    import * as m from "../lib/paraglide/messages";
    import Button from "./Button.svelte";

    const preventDefault = (event) => {
        event.preventDefault();
    };
</script>

<svlete:head>
    <!-- Cal element-click embed code begins -->
    <script type="text/javascript">
        (function (C, A, L) {
            let p = function (a, ar) {
                a.q.push(ar);
            };
            let d = C.document;
            C.Cal =
                C.Cal ||
                function () {
                    let cal = C.Cal;
                    let ar = arguments;
                    if (!cal.loaded) {
                        cal.ns = {};
                        cal.q = cal.q || [];
                        d.head.appendChild(d.createElement("script")).src = A;
                        cal.loaded = true;
                    }
                    if (ar[0] === L) {
                        const api = function () {
                            p(api, arguments);
                        };
                        const namespace = ar[1];
                        api.q = api.q || [];
                        if (typeof namespace === "string") {
                            cal.ns[namespace] = cal.ns[namespace] || api;
                            p(cal.ns[namespace], ar);
                            p(cal, ["initNamespace", namespace]);
                        } else p(cal, ar);
                        return;
                    }
                    p(cal, ar);
                };
        })(window, "https://cal.dropanote.de/embed/embed.js", "init");
        Cal("init", "catchup", { origin: "https://cal.dropanote.de" });

        // Important: Please add the following attributes to the element that should trigger the calendar to open upon clicking.
        // `data-cal-link="freelance/catchup"`
        // data-cal-namespace="catchup"
        // `data-cal-config='{"layout":"month_view"}'`

        Cal.ns.catchup("ui", {
            cssVarsPerTheme: {
                light: { "cal-brand": "#27272a" },
                dark: { "cal-brand": "#f4f4f5" },
            },
            hideEventTypeDetails: false,
            layout: "month_view",
        });
    </script>
    <!-- Cal element-click embed code ends -->
</svlete:head>

<Button
    class="w-full"
    data-cal-namespace="catchup"
    data-cal-link="freelance/catchup"
    data-cal-origin="https://cal.dropanote.de"
    data-cal-config={{ layout: "month_view" }}
    href="https://cal.dropanote.de/freelance/catchup"
    onclick={preventDefault}
    onenter={preventDefault}
    target="_blank"
>
    {m.schedule_call()}</Button
>
