import { paraglideVitePlugin } from "@inlang/paraglide-js";
import embodiMarkdown from "@embodi/markdown";
import tailwindcss from "@tailwindcss/vite";

export default {
  source: "/content",
  plugins: [
    tailwindcss(),
    embodiMarkdown(),
    paraglideVitePlugin({
      project: "./project.inlang", //Path to your inlang project
      outdir: "./__layout/lib/paraglide", //Where you want the generated files to be placed
      strategy: ["url", "baseLocale"],
    }),
  ],
};
