/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./content/**/*.{html,js,njk,md,svelte}",
    "./__layout/**/*.{html,js,njk,md,svelte}",
  ],
  output: "./_site",
  darkMode: "selector",
  theme: {
    extend: {
      screens: {
        print: { raw: "print" },
      },
    },
  },
  plugins: [],
};
