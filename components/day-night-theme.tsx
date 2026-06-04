"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "nuance-theme-mode";

function applyTheme(mode: "day" | "night") {
  document.body.dataset.theme = mode === "day" ? "day" : "";
  if (mode === "day") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
}

export function DayNightTheme() {
  useEffect(() => {
    function sync() {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      // Default is always night unless user explicitly chose day
      applyTheme(saved === "day" ? "day" : "night");
    }

    sync();
    window.addEventListener("nuance-theme-change", sync as EventListener);

    return () => {
      window.removeEventListener("nuance-theme-change", sync as EventListener);
    };
  }, []);

  return null;
}
