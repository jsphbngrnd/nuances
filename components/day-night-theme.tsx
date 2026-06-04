"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "nuance-theme-mode";

function getThemeForHour(date = new Date()) {
  const hour = date.getHours();
  return hour >= 7 && hour < 19 ? "day" : "night";
}

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
      const mode =
        saved === "day" || saved === "night" ? saved : getThemeForHour();
      applyTheme(mode);
    }

    sync();
    window.addEventListener("nuance-theme-change", sync as EventListener);
    const timer = window.setInterval(sync, 60_000);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("nuance-theme-change", sync as EventListener);
    };
  }, []);

  return null;
}
