<script lang="ts">
    import * as m from './lib/paraglide/messages.js'
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
    const { image, alt, descriptions, name, role, degree, location, experience, preferred_techs, preferred_roles, email, socials, offers } = $state(data);
</script>

<Base {data}>
    <main class="pad">
        <section class="teaser order-first">
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
                    <a href="{ social.link }" aria-label="{m.link_to()} { social.name }" target="_blank" rel="external">
                        <i class="ri-{ social.icon } ri-2x"></i>
                    </a>
                    </li>
                {/each}
            </ul>
        </section>
        <Meta class="lg:col-span-3">
            <Item label={m.name()}  content={name} />
            <Item label={m.occupation()} labe content={role} />
            <Item label={m.degree()} content={degree} />

            <Item label={m.developing_experience()}>
                {age(experience)}+ {m.years()}
            </Item>
            <Item label={m.email()}>
                <a class="link" href="mailto:{email}">{email}</a>
            </Item>
            <Item label={m.location()} content={location} />


                <Item label={m.current_tech()} content={preferred_techs} />
            <Item label={m.current_role()} content={preferred_roles} />
        </Meta>

        <section class="markdown lg:col-span-2 lg:-order-1">
            {@render children()}
        </section>

        <ul class="offers">
            {#each offers as offer}
            <li>
                <Card price={offer.price} title={offer.title} sub={offer.subtitle} class="h-full">
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

    main {
        @apply grid lg:grid-cols-5 gap-y-11 gap-x-20 max-w-screen-2xl mx-auto;
    }

    .teaser {
        @apply col-span-full;
        @apply grid grid-cols-2 grid-flow-row mb-7 items-start justify-around w-full lg:max-w-5xl mx-auto;
    }

    .offers {
        @apply grid gap-7 col-span-full grid-cols-[repeat(auto-fill,_minmax(410px,_1fr))];

    }
</style>
