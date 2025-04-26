<script lang="ts">
    import { page } from "$embodi/stores";

    const switchLanguage = (_url: string) => {
        const url = new URL(_url, "https://dropanote.de");
        const language = url.pathname.split("/")[1];
        const newLanguage = language === "en" ? "de" : "en";
        return {
            href: url.pathname.replace(language, newLanguage),
            hreflang: newLanguage,
        };
    };
</script>

<a {...switchLanguage($page.url)} class="button" aria-label="switch language">
    <i class="ri-translate-2"></i>
</a>
