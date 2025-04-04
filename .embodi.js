import { paraglideVitePlugin } from "@inlang/paraglide-js";

export default {
  source: "/content",
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang", //Path to your inlang project
      outdir: "./__layout/lib/paraglide", //Where you want the generated files to be placed
    }),
  ],
};
