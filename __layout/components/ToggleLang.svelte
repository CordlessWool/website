<script lang="ts">
    import { page } from "$embodi/stores";
    import { Languages } from "@lucide/svelte";
    import * as m from "../lib/paraglide/messages.js";

    let { ref } = $props();

    const switchLanguage = (pageUrl: string, ref: string) => {
        const url = new URL(pageUrl, "https://dropanote.de");
        const language = url.pathname.split("/")[1];
        const newLanguage = language === "en" ? "de" : "en";

        if (ref) {
            return {
                href: ref,
                hreflang: newLanguage,
            };
        } else {
            return {
                href: url.pathname.replace(language, newLanguage),
                hreflang: newLanguage,
            };
        }
    };
</script>

<a
    {...switchLanguage($page.url, ref)}
    data-embodi-reload
    class="button"
    aria-label="switch language"
    title={m.switch_lang()}
>
    <Languages />
</a>
