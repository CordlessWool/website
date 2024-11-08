<script lang="ts">
    import { t } from "i18next";
    import Base from "./components/Base.svelte";
    import { age } from "./utils/date.js";

    import '../app.css';

    type Props = {
      children: Snippet;
      data: {
        title: string;
        image: string;
        alt: string;
        description: string;
        name: string;
        role: string;
        degree: string;
        location: string;
        experience: string;
        preferred_techs: string[];
        page: {
          url: string;
        }
        socials: {
          name: string;
          link: string;
          icon: string;
        }[];
      };
    }

    const { data, children }: Props = $props();
    const { title, image, alt, page, description, name, role, degree, location, experience, preferred_techs, socials } = $state(data);
</script>

<Base {data}>
    <main>
        <section class="grid grid-cols-2 grid-flow-row mb-7 items-start justify-around">
            <h2 class="typewriter md:m-10 md:ml-0 sm:mt-18 my-3 hyphens-auto min-h-36">
                { description }
            </h2>

            <div class="justify-self-center self-center row-span-2">
                <img
                    class="rounded-full w-80 border-4 shadow-lg shadow-zinc-400 border-teal-500 border-solid"
                    sizes="400em, 600em, 100vw"
                    src={ image }
                    alt="{ alt }"
                />
            </div>
            <ul class="flex flex-row gap-4 sm:col-auto">
                {#each socials as social}
                    <li title="{ social.name }" class="social-icon">
                    <a href="{ social.link }" aria-label="{t('link_to')} { social.name }" target="_blank" rel="external">
                        <i class="ri-{ social.icon } ri-2x"></i>
                    </a>
                    </li>
                {/each}
            </ul>
        </section>
        <dl class="meta">
            <div>
                <dt>{t("name")}</dt>
                <dd>{name}</dd>
            </div>
            <div>
                <dt>{t("occupation")}</dt>
                <dd>{role}</dd>
            </div>
            <div>
                <dt>{t("degree")}</dt>
                <dd>{degree}</dd>
            </div>
            <div>
                <dt>{t("location")}</dt>
                <dd>{location}</dd>
            </div>
            <div>
                <dt>{t("current_tech")}</dt>
                <div class="list">
                    {#each preferred_techs as tech}
                        <dd>{tech}</dd>
                    {/each}
                </div>
            </div>
            <div>
                <dt>{t("developing_experience")}</dt>
                <dd>{age(experience)}+ {t("years")}</dd>
            </div>
        </dl>

        <section class="markdown">
            {@render children()}
        </section>
    </main>
</Base>
