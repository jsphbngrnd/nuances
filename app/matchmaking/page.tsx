import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { MODE_CONFIG } from "@/lib/modes";
import { getCopy, getModeCopy, getModeName } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function MatchmakingPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = getCopy(locale);
  const modeKey = params.mode === "debate" || params.mode === "funny" || params.mode === "deep" || params.mode === "late-night"
    ? params.mode
    : "late-night";
  const mode = MODE_CONFIG[modeKey];
  const modeCopy = getModeCopy(modeKey, locale);

  return (
    <AppShell locale={locale} showNav={false}>
      <section className="screen-card overflow-hidden">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/6 p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="relative">
            <h1 className="screen-heading mt-4">{t.matchmaking.title}</h1>
            <p className="eyebrow mt-3">{mode.emoji} {getModeName(modeKey, locale)}</p>
            <p className="mt-4 text-sm leading-6 text-ink/78">{modeCopy.waitingCopy}</p>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-white animate-pulseLine" />
              <span className="text-sm uppercase tracking-[0.24em] text-stone">
                {t.matchmaking.searching}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {t.matchmaking.chips.map((item) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-black/24 p-4 text-center text-sm text-ink/74">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/start" className="soft-link">
            {t.matchmaking.cancel}
          </Link>
          <Link
            href={`/topic?mode=${modeKey}`}
            className="rounded-full border border-white/20 bg-white px-5 py-3 text-sm font-semibold text-fog shadow-[0_12px_36px_rgba(255,255,255,0.08)] transition hover:bg-[#f3ecff]"
          >
            {t.matchmaking.found}
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
