<script lang="ts">
    import * as m from './lib/paraglide/messages.js'
    import { Meta, Item } from "./components/meta";
    import Base from "./components/Base.svelte";
    import { age } from "./lib/date.js";

    import { type Snippet } from "svelte";
    import Card from "./components/Card.svelte";
    import Calcom from "./components/Calcom.svelte";
    import PolarChart from "./components/PolarChart.svelte";

    type Props = {
      children: Snippet;
      data: {
        title: string;
        subtitle: string;
        company: string;
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
          title?: string;
          subtitle?: string;
          price?: string;
          html: string;
        }[];
        preferred_roles: string[];
        email: string;
      };
    }
    const { data, children }: Props = $props();
    const { title, subtitle, image, alt, name, role, degree, location, experience, preferred_techs, preferred_roles, email, socials, offers, radarcharts: radars } = $state(data);
</script>

<Base {data}>
    <main class="pad">
        <section class="teaser order-first">
            <div class="typewriter md:m-5 md:ml-0 ">
                <h1 class="">
                    {title}
                </h1>
                <h2 class="hyphens-auto">
                    {subtitle}
                </h2>
            </div>

            <div class="justify-self-center self-center row-span-2 my-3 md:my-10">
                <img
                    class="rounded-full w-80 border-4 shadow-lg shadow-zinc-400 border-teal-500 border-solid"
                    sizes="400em, 600em, 100vw"
                    src={ image }
                    alt="{ alt }"
                />
            </div>
            <ul class="flex flex-row gap-4 col-auto content-center justify-center md:justify-start">
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
            <Item label={m.occupation()} content={role} />
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

        <section class="markdown lg:col-span-2 lg:-order-1 -my-5">
            {@render children()}
        </section>

        {#each radars as r, index (index) }
            <PolarChart data={{
                labels: r.labels,
                datasets: [{
                  data: [...r.data],
                }]
              }}
              scale={[53, 100]}
            />
            <section class="markdown lg:col-span-3 -my-5">
                {@html r.html}
            </section>
        {/each}




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
    @reference "tailwindcss/theme";
    main {
        @apply grid lg:grid-cols-5 gap-y-11 gap-x-20 max-w-(--breakpoint-2xl) mx-auto;
    }

    .teaser {
        @apply col-span-full;
        @apply grid md:grid-cols-2 sm:grid-cols-1 grid-flow-row mb-7 items-start justify-around w-full lg:max-w-5xl mx-auto;

        h1, h2 {
            @apply md:text-left text-center
        }
    }

    .offers {
        @apply col-span-full;
        @apply grid gap-7 grid-cols-1 sm:grid-cols-[repeat(auto-fill,_minmax(410px,_1fr))];

    }
</style>
