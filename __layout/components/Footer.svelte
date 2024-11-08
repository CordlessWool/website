<script lang="ts">
    import { t } from "i18next";
    const currentYear = new Date().getFullYear();

    const { locale } = $props();
</script>

<ul class="flex flex-wrap gap-x-3 text-sm justify-center items-center">
    <li class="">
        <!--freelancermap-Badge White-->
        <a
            href="https://www.freelancermap.de/profil/wolfgang-rathgeb"
            target="_blank"
            title={t("freelancermap_title")}
        >
            <img
                loading="lazy"
                style="width:118px; height:24px"
                alt="freelancermap badge"
                sizes="100em"
                src="https://www.freelancermap.de/images/widgets/dashboard/fm-profile-badge-white.svg"
            />
        </a>
    </li>
    <li class="light clickable button"><a href="/de">DE</a></li>
    <li class="light clickable button"><a href="/en">EN</a></li>
    <li class="light clickable button">
        <a href="/{locale}/imprint/">{t("imprint")}</a>
    </li>
    <li class="light sm:ml-7 text-nowrap">© {currentYear}</li>
</ul>
