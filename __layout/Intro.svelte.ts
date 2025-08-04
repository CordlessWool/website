import * as v from "valibot";
import type { DataSchema, EnrichAction } from "embodi/layout";
import { ImageFiles, loadImage, storeImage } from "@embodi/image";

export const schema: DataSchema = v.object({
  title: v.string(),
  canonical: v.optional(v.string()),
  subtitle: v.string(),
  page_title: v.string(),
  image: ImageFiles,
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
});

const calcCircleBuffer = (size: number) =>
  Buffer.from(
    `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`,
  );

export const enrich: EnrichAction = async (elements) => {
  const { data, helper } = elements;
  const image = loadImage(data.image, helper);
  const webp = image.autoOrient().webp({ quality: 80 });
  const versions = await Promise.all(
    [388, 412, 430, 512, 776, 786, 824, 1024, 1300, 2000].map(async (width) => {
      const version = webp
        .resize({ width, height: width })
        .composite([{ input: calcCircleBuffer(width), blend: "dest-in" }]);
      return await storeImage({ image: version, path: data.image, helper });
    }),
  );

  return {
    ...elements,
    data: {
      ...data,
      image: [
        await storeImage({ image, path: data.image, helper, original: true }),
        ...versions,
      ],
    },
  };
};
