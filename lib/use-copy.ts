"use client";

import { getCopy, type Copy, type Locale } from "@/lib/copy";

// UI locked to English for now. FR copy kept in copy.ts for later.
export function useCopy(): Copy {
  return getCopy("en");
}

export function useLocale(): Locale {
  return "en";
}

export function setLocaleCookie(_locale: Locale) {
  // No-op while UI is locked to English
}
