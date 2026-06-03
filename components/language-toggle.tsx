"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale: Locale = locale === "en" ? "fr" : "en";

  async function updateLocale(target: Locale) {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: target }),
    });
  }

  return (
    <button
      type="button"
      aria-label={locale === "en" ? "Switch to French" : "Passer en anglais"}
      className="fixed right-4 top-4 z-50 rounded-full border border-white/15 bg-white/[0.12] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-card transition hover:border-bone hover:bg-bone hover:text-fog disabled:opacity-70"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await updateLocale(nextLocale);
          router.refresh();
        })
      }
    >
      {isPending ? "..." : locale === "en" ? "EN / FR" : "FR / EN"}
    </button>
  );
}
