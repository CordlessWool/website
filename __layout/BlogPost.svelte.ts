import * as v from "valibot";
import type { DataSchema, EnrichAction, LayoutEvent } from "embodi/layout";
import { ImageFiles, loadImage, storeImage } from "@embodi/image";

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
      const version = webp.resize({ width });
      return await storeImage({ image: version, path, helper });
    }),
  );

  return [
    await storeImage({ image, path, helper, original: true }),
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
  const webp = image.autoOrient().webp({ quality: 70 });
  const versions = await Promise.all(
    widths.map(async (width) => {
      const version = webp.resize({ width });
      return await storeImage({ image: version, path, helper });
    }),
  );

  return [
    await storeImage({ image, path, helper, original: true }),
    ...versions,
  ];
};

export const enrich: EnrichAction = async (elements) => {
  const { data, helper } = elements;

  return {
    html: elements.html,
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
