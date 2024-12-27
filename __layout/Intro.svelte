<script lang="ts">
    import { t } from "i18next";
    import { Meta, Item } from "./components/meta";
    import Base from "./components/Base.svelte";
    import { age } from "./lib/date.js";

    import '../app.css';
    import TypeWriterQueue from "./components/TypeWriterQueue.svelte";
    import type { Snippet } from "svelte";
    import Card from "./components/Card.svelte";
    import Calcom from "./components/Calcom.svelte";

    type Props = {
      children: Snippet;
      data: {
        title: string;
        image: string;
        alt: string;
        descriptions: [string, ...string[]];
        name: string;
        role: string;
        degree: string;
        location: string;
        experience: string;
        preferred_techs: string[];
        locale: string;
        meta: string;
        socials: {
          name: string;
          link: string;
          icon: string;
        }[];
        offers: {
          price: string;
          html: string;
        }[];
      };
    }
    const { data, children }: Props = $props();
    const { image, alt, descriptions, name, role, degree, location, experience, preferred_techs, preferred_roles, email, socials } = $state(data);
</script>

<Base {data}>
    <main>
        <section class="grid grid-cols-2 grid-flow-row mb-7 items-start justify-around">
            <h2 class="typewriter md:m-10 md:ml-0 sm:mt-18 my-3 hyphens-auto min-h-36">
                <TypeWriterQueue snippeds={descriptions} />
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
        <Meta>
            <Item i18n="name" content={name} />
            <Item i18n="occupation" content={role} />
            <Item i18n="degree" content={degree} />
            <Item i18n="developing_experience">
                {age(experience)}+ {t("years")}
            </Item>
            <Item i18n="email">
                <a class="link" href="mailto:{email}">{email}</a>
            </Item>
            <Item i18n="location" content={location} />


            <Item i18n="current_tech" content={preferred_techs} />
            <Item i18n="current_role" content={preferred_roles} />
        </Meta>

        <section class="markdown">
            {@render children()}
        </section>

        <ul class="offers">
            {#each offers as offer}
            <li>
                <Card price={offer.price} class="h-full">
                    {@html offer.html}
                    {#snippet actions()}
                    <Calcom />
                    {/snippet}

                </Card>
            </li>
            {/each}
        </ul>
    </main>
</Base>

<style lang="postcss">
    .offers {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
    }
</style>
