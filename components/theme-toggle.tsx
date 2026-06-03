"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "nuance-theme-mode";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"day" | "night">("night");

  useEffect(() => {
    const currentTheme =
      document.body.dataset.theme === "day" ? "day" : "night";
    setTheme(currentTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "day" ? "night" : "day";
    document.body.dataset.theme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event("nuance-theme-change"));
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle-button"
      aria-label={theme === "day" ? "Passer en mode sombre" : "Passer en mode clair"}
      title={theme === "day" ? "Mode sombre" : "Mode clair"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === "day" ? "◐" : "◑"}
      </span>
      <span className="theme-toggle-label">
        {theme === "day" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
