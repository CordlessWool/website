import { paraglideVitePlugin } from "@inlang/paraglide-js";
import embodiMarkdown from "@embodi/markdown";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import { transformerNotationDiff } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";
import tailwindcss from "@tailwindcss/vite";

export default {
  source: "/content",
  plugins: [
    tailwindcss(),
    embodiMarkdown({
      remarkPlugins: [],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "github-dark",
            transformers: [
              transformerNotationDiff(),
              transformerCopyButton({
                visibility: "always",
                feedbackDuration: 3000,
              }),
            ],
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
