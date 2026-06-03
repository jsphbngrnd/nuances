"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "nuance-theme-mode";

function getThemeForHour(date = new Date()) {
  const hour = date.getHours();
  return hour >= 7 && hour < 19 ? "day" : "night";
}

export function DayNightTheme() {
  useEffect(() => {
    function applyTheme() {
      const savedTheme =
        typeof window !== "undefined"
          ? window.localStorage.getItem(THEME_STORAGE_KEY)
          : null;

      document.body.dataset.theme =
        savedTheme === "day" || savedTheme === "night"
          ? savedTheme
          : getThemeForHour();
    }

    applyTheme();
    window.addEventListener("nuance-theme-change", applyTheme as EventListener);
    const timer = window.setInterval(applyTheme, 60_000);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("nuance-theme-change", applyTheme as EventListener);
    };
  }, []);

  return null;
}
