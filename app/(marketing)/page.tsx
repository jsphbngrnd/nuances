import Link from "next/link";
import { liveStats } from "@/lib/mock-data";
import { ModeCarousel } from "@/components/mode-carousel";
import { getCopy } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function LandingPage() {
  const locale = await getLocale();
  const t = getCopy(locale);

  return (
    <main className="editorial-grid min-h-screen">
      <div className="app-frame pb-16">
        <header className="flex items-center justify-between py-2">
          <div>
            <p className="mt-2 font-display text-3xl tracking-[-0.04em]">NUANCE</p>
            <p className="eyebrow mt-2">{t.marketing.eyebrow}</p>
          </div>
          <Link
            href="/auth"
            className="rounded-full border border-white/15 bg-white/[0.12] px-4 py-2 text-sm font-medium text-white transition hover:border-bone hover:bg-bone hover:text-fog"
          >
            {t.marketing.signIn}
          </Link>
        </header>

        <section className="liquid-panel mt-10 overflow-hidden rounded-[30px] p-6">
          <h1 className="screen-heading mt-4 max-w-[10ch] text-[4.6rem]">
            {t.marketing.heroTitle}
          </h1>
          <p className="eyebrow mt-3">{t.marketing.heroEyebrow}</p>
          <p className="mt-6 max-w-[32ch] text-base leading-7 text-ink/78">
            {t.marketing.heroBody}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <p className="eyebrow">{t.marketing.liveNow}</p>
              <p className="mt-3 font-display text-5xl">{liveStats.onlineNow}</p>
              <p className="mt-2 text-sm text-stone">{t.marketing.liveNowBody}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
              <p className="eyebrow">{t.marketing.completion}</p>
              <p className="mt-3 font-display text-5xl">{liveStats.completionRate}</p>
              <p className="mt-2 text-sm text-stone">{t.marketing.completionBody}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="rounded-full border border-white/20 bg-white px-5 py-3 text-sm font-semibold text-fog shadow-[0_12px_36px_rgba(255,255,255,0.08)] transition hover:bg-[#f3ecff]"
          >
              {t.marketing.ctaPrimary}
            </Link>
            <Link
              href="/start"
              className="rounded-full border border-white/20 bg-black/45 px-5 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-white hover:bg-white hover:text-fog"
          >
              {t.marketing.ctaSecondary}
            </Link>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow mt-3">{t.marketing.modesEyebrow}</p>
              <h2 className="mt-3 font-display text-[2.6rem] leading-[0.92] tracking-[-0.04em]">
                {t.marketing.modesTitle}
              </h2>
            </div>
            <p className="mt-2 max-w-[18ch] text-right text-sm leading-6 text-stone">
              {t.marketing.modesBody}
            </p>
          </div>
          <ModeCarousel locale={locale} />
        </section>
      </div>
    </main>
  );
}
