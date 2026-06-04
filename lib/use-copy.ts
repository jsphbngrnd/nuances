"use client";

import { useEffect, useState } from "react";
import { getCopy, type Copy, type Locale } from "@/lib/copy";

function getLocaleCookie(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)nuance-locale=([^;]*)/);
  const val = match?.[1];
  return val === "fr" ? "fr" : "en";
}

export function useCopy(): Copy {
  // Always start with "en" so server + client initial render match (no hydration error).
  // useEffect applies the real locale after hydration.
  const [copy, setCopy] = useState<Copy>(getCopy("en"));

  useEffect(() => {
    const sync = () => setCopy(getCopy(getLocaleCookie()));
    sync();
    window.addEventListener("nuance-locale-change", sync);
    return () => window.removeEventListener("nuance-locale-change", sync);
  }, []);

  return copy;
}

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("en");
  useEffect(() => {
    const sync = () => setLocale(getLocaleCookie());
    sync();
    window.addEventListener("nuance-locale-change", sync);
    return () => window.removeEventListener("nuance-locale-change", sync);
  }, []);
  return locale;
}

/** Call this whenever you change the nuance-locale cookie */
export function setLocaleCookie(locale: Locale) {
  document.cookie = `nuance-locale=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  window.dispatchEvent(new Event("nuance-locale-change"));
}
