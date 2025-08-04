import * as v from "valibot";
import type { DataSchema, EnrichAction, LayoutEvent } from "embodi/layout";
import { ImageFiles, loadImage, storeImage } from "@embodi/image";
import sharp from "sharp";
import { unified } from "unified";
import parse from "rehype-parse";
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import wrap from "rehype-wrap";
import stringify from "rehype-stringify";

export const schema: DataSchema = v.looseObject({
  title: v.string(),
  description: v.string(),
  hero: v.optional(
    v.object({
      image: ImageFiles,
      alt: v.string(),
      photographer: v.optional(v.string()),
      photographer_link: v.optional(v.string()),
    }),
  ),
  author: v.object({
    name: v.string(),
    photo: ImageFiles,
    description: v.string(),
  }),
});

const transformHeroImage = async ({
  path,
  widths,
  helper,
}: {
  path: string;
  widths: number[];
  helper: LayoutEvent["helper"];
}) => {
  const image = loadImage(path, helper);
  const webp = image.autoOrient().webp({ quality: 70 });
  const versions = await Promise.all(
    widths.map(async (width) => {
      const version = webp.resize(width, Math.floor(width * 0.4), {
        fit: "cover",
        kernel: sharp.kernel.mitchell,
      });
      return await storeImage({ image: version, path, helper });
    }),
  );

  return [
    await storeImage({
      image: image
        .autoOrient()
        .resize(1200, Math.floor(1200 * 0.4), { fit: "cover" }),
      path,
      helper,
      original: true,
    }),
    ...versions,
  ];
};

const transformAuthorImage = async ({
  path,
  widths,
  helper,
}: {
  path: string;
  widths: number[];
  helper: LayoutEvent["helper"];
}) => {
  const image = loadImage(path, helper);
  const webp = image.autoOrient().webp({ quality: 75 });
  const versions = await Promise.all(
    widths.map(async (width) => {
      const version = webp.resize({
        width,
        fit: "cover",
      });
      return await storeImage({ image: version, path, helper });
    }),
  );

  return [
    await storeImage({
      image: image.autoOrient().resize({
        width: widths[0],
        fit: "cover",
      }),
      path,
      helper,
      original: true,
    }),
    ...versions,
  ];
};

const addToc = (html: string) => {
  const processor = unified()
    .use(parse)
    .use(slug)
    .use(wrap, { wrapper: "div.content" })
    .use(toc, { position: "beforebegin", headings: ["h1", "h2"] })
    .use(stringify);
  return processor.process(html);
};

export const enrich: EnrichAction = async (elements) => {
  const { data, html, helper } = elements;
  if (!html) throw new Error("Missing HTML content");
  return {
    html: (await addToc(html)).toString(),
    data: {
      ...data,
      hero: data.hero
        ? {
            ...data.hero,
            image: await transformHeroImage({
              path: data.hero.image,
              widths: [375, 390, 412, 430, 512, 824, 1024, 2048],
              helper,
            }),
          }
        : undefined,
      author: {
        ...data.author,
        photo: await transformAuthorImage({
          path: data.author.photo,
          widths: [192, 384],
          helper,
        }),
      },
    },
  };
};
