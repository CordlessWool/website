export function darkLightMode() {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  const themeToggleButton = document.getElementById("toggle-color-theme");
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      localStorage.theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    });
  }
}
