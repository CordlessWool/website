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

const addToc = async (html: string): Promise<string> => {
  const processor = unified()
    .use(parse, { fragment: true })
    .use(slug, {
      prefix: "section-",
    })
    .use(wrap, { wrapper: "div.content" })
    .use(toc, { position: "beforebegin", headings: ["h1", "h2"] })
    .use(stringify);
  return String(await processor.process(html));
};

const findAndReplaceImageInHTML = async (
  html: string,
  widths: number[],
  helper: LayoutEvent["helper"],
) => {
  const regex = /<img[^>]+src="(\$assets\/[^"]+)" alt="([^"]+)"[^>]*>/g;
  const images = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    const image = loadImage(src, helper);
    const webp = image.autoOrient().webp({ quality: 80 });
    const versions = await Promise.all(
      widths.map(async (width) => {
        const version = webp.resize({
          width,
          fit: "cover",
        });
        return await storeImage({ image: version, path: src, helper });
      }),
    );
    images.push(...versions);
    const defaultVersion = await storeImage({ image, path: src, helper });
    html = html.replace(
      match[0],
      `<picture><source srcset="${versions.map((v) => `${v.src} ${v.width}w`).join(", ")}" type="image/webp"><img src="${defaultVersion.src}" alt="${match[2]}" /></picture>`,
    );
  }
  return html;
};

export const enrich: EnrichAction = async (elements) => {
  const { data, html, helper } = elements;
  if (!html) throw new Error("Missing HTML content");

  let modified = await addToc(html);
  modified = await findAndReplaceImageInHTML(
    modified,
    [388, 512, 786, 1024],
    helper,
  );
  return {
    html: modified,
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
