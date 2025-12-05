import { paraglideVitePlugin } from "@inlang/paraglide-js";
import embodiMarkdown from "@embodi/markdown";
import { transformerCopyButton } from "@rehype-pretty/transformers";

import rehypeSlug from "rehype-slug";
import { transformerNotationDiff } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeMermaid from "rehype-mermaid";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import tailwindcss from "@tailwindcss/vite";

export default {
  origin: "https://dropanote.de",
  source: "/content",
  plugins: [
    tailwindcss(),
    embodiMarkdown({
      settings: { allowDangerousHtml: true },
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [
          rehypeSlug,
          {
            prefix: "section-",
          },
        ],
        [
          rehypeMermaid,
          {
            strategy: "inline-svg",
            dark: false,
            mermaidConfig: {
              theme: "base",
              layout: "dagre",
              look: "classic",
              themeVariables: {
                // primaryColor: "#e5e7eb",
                // primaryTextColor: "#374151",
                // primaryBorderColor: "#6366f1",
                lineColor: "#6b7280",
                // background: "transparent",
                // mainBkg: "#f3f4f6",
                // secondaryColor: "#d1d5db",
                // tertiaryColor: "#e5e7eb",
                edgeLabelBackground: "transparent",
                // clusterBkg: "#f3f4f6",
                // clusterBorder: "#9ca3af",
                // defaultLinkColor: "#6b7280",
                // titleColor: "#374151",
                // nodeTextColor: "#374151",
              },
            },
          },
        ],
        [
          rehypePrettyCode,
          {
            theme: "github-dark-high-contrast",
            transformers: [
              transformerNotationDiff(),
              transformerCopyButton({
                visibility: "always",
                feedbackDuration: 3000,
              }),
            ],
          },
        ],
        [
          rehypeRaw,
          {
            passThrough: ["br"],
          },
        ],
      ],
    }),
    paraglideVitePlugin({
      project: "./project.inlang", //Path to your inlang project
      outdir: "./__layout/lib/paraglide", //Where you want the generated files to be placed
      strategy: ["url", "baseLocale"],
    }),
  ],
};
