import { writable } from "svelte/store";

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

export const themeStore = writable(THEME.LIGHT);
