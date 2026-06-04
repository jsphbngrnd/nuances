"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "nuance-theme-mode";

function applyTheme(mode: "day" | "night") {
  document.body.dataset.theme = mode === "day" ? "day" : "";
  if (mode === "day") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"day" | "night">("night");

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initial =
      saved === "day" || saved === "night"
        ? saved
        : document.body.dataset.theme === "day"
        ? "day"
        : "night";
    setTheme(initial);
  }, []);

  function toggle() {
    const next = theme === "day" ? "night" : "day";
    applyTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event("nuance-theme-change"));
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle-button"
      aria-label={theme === "day" ? "Switch to dark" : "Switch to light"}
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
