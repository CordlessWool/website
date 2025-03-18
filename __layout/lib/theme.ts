import { writable } from "svelte/store";

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};

export function getTheme() {
  if (import.meta.env.SSR) {
    return THEME.LIGHT;
  }

  return document.documentElement.classList.contains("dark")
    ? THEME.DARK
    : THEME.LIGHT;
}

export const themeStore = writable(getTheme());
