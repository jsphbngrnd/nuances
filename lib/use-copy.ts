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
  const [copy, setCopy] = useState<Copy>(() => getCopy(getLocaleCookie()));

  useEffect(() => {
    setCopy(getCopy(getLocaleCookie()));

    // Re-sync when locale cookie changes (e.g. toggled in Account)
    const id = setInterval(() => setCopy(getCopy(getLocaleCookie())), 1000);
    return () => clearInterval(id);
  }, []);

  return copy;
}

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(() => getLocaleCookie());
  useEffect(() => {
    setLocale(getLocaleCookie());
    const id = setInterval(() => setLocale(getLocaleCookie()), 1000);
    return () => clearInterval(id);
  }, []);
  return locale;
}
