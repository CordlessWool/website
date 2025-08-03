import * as v from "valibot";
import type { DataSchema, EnrichAction, LayoutEvent } from "embodi/layout";
import { ImageFiles, loadImage, storeImage } from "@embodi/image";

export const schema: DataSchema = v.looseObject({
  title: v.string(),
  description: v.string(),
  hero: ImageFiles,
  author: ImageFiles,
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
    await storeImage({ image, path: data.hero, helper, original: true }),
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
    await storeImage({ image, path: data.hero, helper, original: true }),
    ...versions,
  ];
};

export const enrich: EnrichAction = async (elements) => {
  const { data, helper } = elements;

  return {
    ...elements,
    data: {
      ...data,
      hero: transformHeroImage({
        path: data.hero,
        widths: [375, 390, 412, 430, 512, 824, 1024, 2048],
        helper,
      }),
      author: transformAuthorImage({
        path: data.author.photo,
        widths: [192, 384],
        helper,
      }),
    },
  };
};
