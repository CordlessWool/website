import { paraglide } from "@inlang/paraglide-vite";

export default {
  source: "/content",
  plugins: [
    paraglide({
      project: "./project.inlang", //Path to your inlang project
      outdir: "./__layout/lib/paraglide", //Where you want the generated files to be placed
    }),
  ],
};
