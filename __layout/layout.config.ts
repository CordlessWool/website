import { defineLayout } from "embodi/config";

const intro = defineLayout({
  component: "./Intro.svelte",
  schema: ({ v, e }) =>
    v.objectAsync({
      title: v.string(),
      canonical: v.optional(v.string()),
      subtitle: v.string(),
      page_title: v.string(),
      image: v.pipe(
        v.string(),
        e.image(
          [500, 786, 1000, 1300, 2000].map((size) => ({
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
      meta: v.record(v.string(), v.any()),
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

const projects = defineLayout({
  component: "./Projects.svelte",
  schema: ({ v }) => v.record(v.string(), v.any()),
});

const markdownOnly = defineLayout({
  component: "./MarkdownOnly.svelte",
  schema: ({ v }) => v.record(v.string(), v.any()),
});

const blogOverview = defineLayout({
  component: "./BlogOverview.svelte",
  schema: ({ v }) => v.record(v.string(), v.any()),
});

const blogPost = defineLayout({
  component: "./BlogPost.svelte",
  schema: ({ v, e }) =>
    v.looseObjectAsync({
      title: v.string(),
      description: v.string(),
      hero: v.optional(
        v.objectAsync({
          image: v.pipe(
            v.string(),
            e.image(
              [500, 786, 1000, 1300, 2000].map((size) => ({
                width: size,
                format: "webp",
                quality: 70,
              })),
            ),
          ),
          alt: v.string(),
          photographer: v.optional(v.string()),
          photographer_link: v.optional(v.string()),
        }),
      ),
      author: v.optional(
        v.objectAsync({
          name: v.string(),
          photo: v.pipe(
            v.string(),
            e.image(
              [256, 512].map((size) => ({
                width: size,
                format: "webp",
                quality: 80,
              })),
            ),
          ),
          description: v.string(),
        }),
      ),
    }),
});

const ProjectPage = defineLayout({
  component: "./ProjectPage.svelte",
  schema: ({ v }) => v.record(v.string(), v.any()),
});

export const layouts = {
  intro,
  projects,
  markdownOnly,
  blogOverview,
  blogPost,
  ProjectPage,
};
