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
        <header className="flex items-center justify-between py-3">
          <div>
            <p className="font-display text-3xl tracking-[-0.04em] text-foreground">NUANCE</p>
            <p className="eyebrow mt-1">{t.marketing.eyebrow}</p>
          </div>
          <Link
            href="/auth"
            className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            {t.marketing.signIn}
          </Link>
        </header>

        {/* Hero */}
        <section className="glass-panel mt-6 p-6">
          <p className="eyebrow">{t.marketing.heroEyebrow}</p>
          <h1 className="mt-3 font-display text-[3.2rem] leading-[0.92] tracking-[-0.04em] text-foreground">
            {t.marketing.heroTitle}
          </h1>
          <p className="mt-5 max-w-[30ch] text-sm leading-6 text-muted-foreground">
            {t.marketing.heroBody}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border-soft bg-surface p-4">
              <p className="eyebrow">{t.marketing.liveNow}</p>
              <p className="mt-2 font-display text-4xl leading-none text-foreground">{liveStats.onlineNow}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{t.marketing.liveNowBody}</p>
            </div>
            <div className="rounded-xl border border-border-soft bg-surface p-4">
              <p className="eyebrow">{t.marketing.completion}</p>
              <p className="mt-2 font-display text-4xl leading-none text-foreground">{liveStats.completionRate}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{t.marketing.completionBody}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {t.marketing.ctaPrimary}
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-strong"
            >
              {t.marketing.ctaSecondary}
            </Link>
          </div>
        </section>

        {/* Modes */}
        <section className="mt-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{t.marketing.modesEyebrow}</p>
              <h2 className="mt-2 font-display text-[2.2rem] leading-[0.94] tracking-[-0.04em] text-foreground">
                {t.marketing.modesTitle}
              </h2>
            </div>
            <p className="mt-2 max-w-[16ch] text-right text-xs leading-5 text-muted-foreground">
              {t.marketing.modesBody}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LIVE_MODES.map((modeId) => {
              const mode = MODE_CONFIG[modeId];
              return (
                <div
                  key={modeId}
                  className="glass-panel flex flex-col gap-2 p-4"
                >
                  <span className="text-xl leading-none">{mode.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{mode.name}</p>
                    <p className="mt-0.5 text-xs leading-4 text-muted-foreground">{mode.shortLabel}</p>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">{mode.tagline}</p>
                  <span className="eyebrow self-start">{mode.cadence}</span>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
}
