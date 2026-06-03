import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export function formatModeLabel(mode: string) {
  if (mode === "debate") return "⚔️ Debate";
  if (mode === "deep") return "🧠 Deep";
  if (mode === "late-night") return "🌙 Late Night";
  return mode;
}
