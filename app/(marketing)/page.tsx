import Link from "next/link";
import { liveStats } from "@/lib/mock-data";
import { MODE_CONFIG } from "@/lib/modes";
import { getCopy } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";
import type { ConversationMode } from "@/lib/types";

const LIVE_MODES: ConversationMode[] = ["debate", "funny", "deep", "late-night"];

export default async function LandingPage() {
  const locale = await getLocale();
  const t = getCopy(locale);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[460px] px-5 pb-16">

        {/* Header */}
        <header className="flex items-start justify-between pt-5 pb-4">
          <div>
            <p className="font-display text-2xl leading-none tracking-[-0.04em] text-foreground">
              NUANCE
            </p>
            <p className="eyebrow mt-1.5">{t.marketing.eyebrow}</p>
          </div>
          <Link
            href="/auth"
            className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-strong"
          >
            {t.marketing.signIn}
          </Link>
        </header>

        {/* Hero panel */}
        <section className="glass-panel p-5">
          <p className="eyebrow">{t.marketing.heroEyebrow}</p>
          <h1 className="mt-3 font-display text-[2.2rem] leading-[0.94] tracking-[-0.04em] text-foreground">
            {t.marketing.heroTitle}
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {t.marketing.heroBody}
          </p>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border-soft bg-surface p-3.5">
              <p className="eyebrow">{t.marketing.liveNow}</p>
              <p className="mt-2 font-display text-3xl leading-none text-foreground">
                {liveStats.onlineNow}
              </p>
              <p className="mt-1.5 text-xs leading-4 text-muted-foreground">
                {t.marketing.liveNowBody}
              </p>
            </div>
            <div className="rounded-xl border border-border-soft bg-surface p-3.5">
              <p className="eyebrow">{t.marketing.completion}</p>
              <p className="mt-2 font-display text-3xl leading-none text-foreground">
                {liveStats.completionRate}
              </p>
              <p className="mt-1.5 text-xs leading-4 text-muted-foreground">
                {t.marketing.completionBody}
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/auth"
              className="flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t.marketing.ctaPrimary}
            </Link>
            <Link
              href="/demo"
              className="flex w-full items-center justify-center rounded-full border border-border py-3.5 text-sm font-semibold text-foreground transition hover:bg-surface"
            >
              {t.marketing.ctaSecondary}
            </Link>
          </div>
        </section>

        {/* Modes section */}
        <section className="mt-8 space-y-4">
          <div>
            <p className="eyebrow">{t.marketing.modesEyebrow}</p>
            <h2 className="mt-2 font-display text-[1.9rem] leading-[0.94] tracking-[-0.04em] text-foreground">
              {t.marketing.modesTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t.marketing.modesBody}
            </p>
          </div>

          {/* Mode cards — full width stacked on narrow, 2-col on wider */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {LIVE_MODES.map((modeId) => {
              const mode = MODE_CONFIG[modeId];
              return (
                <div key={modeId} className="glass-panel p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl leading-none">{mode.emoji}</span>
                    <span className="eyebrow">{mode.cadence}</span>
                  </div>
                  <p className="mt-3 font-display text-[1.5rem] leading-[0.96] tracking-[-0.03em] text-foreground">
                    {mode.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{mode.shortLabel}</p>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}
