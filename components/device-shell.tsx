"use client";

import { useEffect, useState } from "react";

export function DeviceShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"night" | "day">("night");

  useEffect(() => {
    const saved = localStorage.getItem("nuance-theme");
    if (saved === "day") applyTheme("day");
  }, []);

  function applyTheme(t: "night" | "day") {
    setTheme(t);
    localStorage.setItem("nuance-theme", t);
    document.documentElement.dataset.theme = t === "day" ? "day" : "";
  }

  // Expose theme controls globally so Account screen can toggle
  useEffect(() => {
    (window as any).__nuanceSetTheme = applyTheme;
    (window as any).__nuanceTheme = theme;
  }, [theme]);

  return (
    <div className="np-stage">
      <div className="np-device">
        {children}
      </div>
    </div>
  );
}
