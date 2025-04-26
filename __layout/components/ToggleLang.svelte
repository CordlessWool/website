<script lang="ts">
    const toggleLanguage = () => {
        const url = new URL(window.location.href);
        const language = url.pathname.split("/")[1];
        const newLanguage = language === "en" ? "de" : "en";
        url.pathname = url.pathname.replace(language, newLanguage);
        window.location.href = url.href;
    };
</script>

<button class="button" onclick={toggleLanguage} aria-label="switch language">
    <i class="ri-translate-2"></i>
</button>
