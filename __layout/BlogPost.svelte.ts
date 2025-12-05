import * as v from "valibot";
import type { DataSchema, EnrichAction, LayoutEvent } from "embodi/layout";
import {
  DefaultImageFile,
  ImageFile,
  ImageFiles,
  loadImage,
  storeImage,
} from "@embodi/image";
import sharp from "sharp";
import { unified, type Plugin } from "unified";
import parse from "rehype-parse";
import slug from "rehype-slug";
import toc from "@jsdevtools/rehype-toc";
import wrap from "rehype-wrap";
import stringify from "rehype-stringify";
import { remove } from "unist-util-remove";
import { visit } from "unist-util-visit";
import type { Node } from "unist";

export const schema: DataSchema = v.looseObject({
  topic: v.optional(v.string()),
  title: v.string(),
  description: v.string(),
  ref: v.optional(v.pipe(v.string(), v.endsWith("/"))),
  hero: v.optional(
    v.object({
      image: ImageFiles,
      alt: v.optional(v.string()),
      photographer: v.optional(v.string()),
      photographer_link: v.optional(v.string()),
    }),
  ),
  author: v.object({
    name: v.string(),
    title: v.string(),
    photo: ImageFiles,
    description: v.string(),
  }),
});

const transformImage = async ({
  path,
  widths,
  helper,
  quality = 80,
  ratio,
}: {
  path: string;
  widths: number[];
  helper: LayoutEvent["helper"];
  quality?: number;
  ratio?: number;
}): Promise<[DefaultImageFile, ...ImageFile[]]> => {
  const image = loadImage(path, helper);
  const webp = image.autoOrient().webp({ quality });
  const webpPath = path.replace(/\.(jpg|jpeg|png)$/, ".webp");
  const calcHeight = (width: number) =>
    ratio ? Math.floor(width * ratio) : undefined;
  const versions = await Promise.all(
    widths.map(async (width) => {
      const version = webp.resize(width, calcHeight(width), {
        fit: "cover",
        kernel: sharp.kernel.mitchell,
      });
      return (await storeImage({
        image: version,
        path: webpPath,
        helper,
      })) as ImageFile;
    }),
  );

  return [
    (await storeImage({
      image: image
        .autoOrient()
        .resize(1200, calcHeight(1200), { fit: "cover" }),
      path,
      helper,
      original: true,
    })) as DefaultImageFile,
    ...versions,
  ];
};

const rehypeImage: Plugin<
  [
    options: {
      widths: number[];
      helper: LayoutEvent["helper"];
      quality?: number | undefined;
    },
  ]
> = (options) => async (tree: Node) => {
  let nodes: [any, number | undefined, any][] = [];
  visit(tree, ["element"], (node: any, i, parent) => {
    if (node.tagName !== "img") {
      return;
    }
    nodes.push([node, i, parent]);
  });
  await Promise.all(
    nodes.map(async ([node, i, parent]) => {
      const {
        properties: { src: path, alt, title },
      } = node;
      const [image, ...imageVersions] = await transformImage({
        path,
        widths: options.widths,
        helper: options.helper,
        quality: options.quality,
      });
      const imageElement = {
        type: "element",
        tagName: "img",
        properties: {
          src: image.src,
          srcset: imageVersions
            .map((version) => `${version.src} ${version.width}w`)
            .join(", "),
          alt,
          loading: "lazy",
        },
      };

      const children = title
        ? [
            imageElement,
            {
              type: "element",
              tagName: "figcaption",
              children: [{ type: "text", value: title }],
            },
          ]
        : [imageElement];

      const figureElement = {
        type: "element",
        tagName: "figure",
        properties: {
          "data-rehype-pretty-image-figure": true,
        },
        children,
      };

      parent.children.splice(i, 1, figureElement);
    }),
  );
};

function rehypeRemoveH1() {
  return (tree: Node) => {
    remove(tree, { tagName: "h1" });
  };
}

const modifyHTML = async (
  html: string,
  helper: LayoutEvent["helper"],
): Promise<string> => {
  const processor = unified()
    .use(parse, { fragment: true })
    .use(slug, {
      prefix: "section-",
    })
    .use(wrap, { wrapper: "div.content" })
    .use(toc, { position: "beforebegin", headings: ["h1", "h2"] })
    .use(rehypeRemoveH1)
    .use(rehypeImage, { widths: [388, 680, 776, 1360], helper })
    .use(stringify);
  return String(await processor.process(html));
};

export const enrich: EnrichAction = async (elements) => {
  const { data, html, helper } = elements;
  if (!html) throw new Error("Missing HTML content");

  let modified = await modifyHTML(html, helper);
  return {
    html: modified,
    data: {
      ...data,
      hero: data.hero
        ? {
            ...data.hero,
            image: await transformImage({
              path: data.hero.image,
              widths: [375, 390, 412, 430, 512, 824, 1024, 2048],
              helper,
              ratio: 0.4,
              quality: 75,
            }),
          }
        : undefined,
      author: {
        ...data.author,
        photo: await transformImage({
          path: data.author.photo,
          widths: [192, 384],
          helper,
          ratio: 1,
        }),
      },
    },
  };
};
