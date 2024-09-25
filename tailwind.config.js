/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,njk,md}"],
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
