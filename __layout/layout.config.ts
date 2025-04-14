import { defineLayout } from "embodi/config";

const intro = defineLayout({
  component: "./Intro.svelte",
  schema: ({ v, e }) =>
    v.objectAsync({
      title: v.string(),
      subtitle: v.string(),
      page_title: v.string(),
      image: v.pipe(
        v.string(),
        e.image(
          [300, 500, 800, 1000, 1300, 2000].map((size) => ({
            width: size,
            format: "webp",
            quality: 70,
          })),
        ),
      ),
      alt: v.string(),
      name: v.string(),
      role: v.string(),
      degree: v.string(),
      location: v.string(),
      experience: v.string(),
      preferred_techs: v.array(v.string()),
      preferred_roles: v.array(v.string()),
      locale: v.string(),
      meta: v.string(),
      socials: v.array(
        v.object({
          name: v.string(),
          link: v.string(),
          icon: v.string(),
        }),
      ),
      offers: v.array(
        v.object({
          title: v.optional(v.string()),
          subtitle: v.optional(v.string()),
          price: v.optional(v.string()),
          html: v.string(),
        }),
      ),
      email: v.pipe(v.string(), v.email()),
      radarcharts: v.array(
        v.object({
          html: v.string(),
          data: v.array(v.number()),
          labels: v.array(v.string()),
        }),
      ),
    }),
});

export const layouts = { intro };
