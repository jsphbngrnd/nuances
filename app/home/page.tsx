import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getConversationQuoteOfTheDay, liveStats } from "@/lib/mock-data";
import { MODE_CONFIG } from "@/lib/modes";
import { getCopy, getModeName } from "@/lib/i18n";
import { getCurrentIdentity } from "@/lib/server-identity";
import { getLocale } from "@/lib/server-locale";
import type { ConversationMode } from "@/lib/types";

const LIVE_MODES: ConversationMode[] = ["debate", "funny", "deep", "late-night"];

export default async function HomePage() {
  const locale = await getLocale();
  const identity = await getCurrentIdentity();
  const t = getCopy(locale);
  const quote = getConversationQuoteOfTheDay(locale);
  const greeting = locale === "fr" ? "Bonsoir" : "Good evening";

  return (
    <AppShell locale={locale} currentNav="/home" showNav>
      <div className="space-y-5">

        {/* Profile chip */}
        <Link
          href="/account"
          className="flex w-full items-center gap-3 rounded-full border border-border-soft bg-surface px-4 py-3 transition hover:bg-surface-strong"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-soft bg-surface-strong text-xs font-semibold uppercase text-foreground">
            {identity.alias.charAt(0)}
          </div>
          <span className="eyebrow flex-1 truncate">
            {greeting} · {identity.alias.toUpperCase()}
          </span>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>

        {/* Hero */}
        <div className="space-y-3 px-1 text-center">
          <h1 className="screen-heading">{t.home.title}</h1>
          <p className="mx-auto max-w-[28ch] text-sm leading-6 text-muted-foreground">
            {t.home.body}
          </p>
          <div className="flex justify-center pt-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-surface px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-positive" />
              <span className="eyebrow">{liveStats.onlineNow} {t.home.onlineNow}</span>
            </div>
          </div>
        </div>

        {/* Mode grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="eyebrow">{locale === "fr" ? "Choisissez l'ambiance" : "Pick the atmosphere"}</span>
            <span className="eyebrow">{locale === "fr" ? "Quatre modes" : "Four modes"}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LIVE_MODES.map((modeId) => {
              const mode = MODE_CONFIG[modeId];
              return (
                <div
                  key={modeId}
                  className="glass-panel flex flex-col gap-3 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-2xl leading-none">{mode.emoji}</span>
                    <span className="eyebrow shrink-0">{mode.cadence}</span>
                  </div>
                  <div>
                    <p className="font-display text-[1.6rem] leading-[0.94] tracking-[-0.03em] text-foreground">
                      {mode.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{mode.shortLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/start"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {t.home.launchCta} →
          </Link>
        </div>

        {/* Quote of the day */}
        <div className="glass-panel p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="eyebrow">{t.home.quoteEyebrow}</p>
            <span className="rounded-full border border-border-soft bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
              {getModeName(quote.mode, locale)}
            </span>
          </div>
          <blockquote className="mt-4 font-display text-[1.8rem] italic leading-[1.05] tracking-[-0.02em] text-foreground">
            "{quote.quote}"
          </blockquote>
        </div>

      </div>
    </AppShell>
  );
}
