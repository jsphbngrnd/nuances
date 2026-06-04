import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { HomeQuoteCard } from "@/components/home-quote-card";
import { getConversationQuoteOfTheDay, liveStats, mockReconnects } from "@/lib/mock-data";
import { MODE_CONFIG } from "@/lib/modes";
import { getCopy, translateReconnectStatus, translateSampleText } from "@/lib/i18n";
import { getCurrentIdentity } from "@/lib/server-identity";
import { getLocale } from "@/lib/server-locale";
import type { ConversationMode } from "@/lib/types";

const LIVE_MODES: ConversationMode[] = ["debate", "funny", "deep", "late-night"];

export default async function HomePage() {
  const locale = await getLocale();
  const identity = await getCurrentIdentity();
  const t = getCopy(locale);
  const quote = getConversationQuoteOfTheDay(locale);

  return (
    <AppShell locale={locale} currentNav="/home" showNav>
      <div className="space-y-4">

        {/* Header */}
        <div className="px-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="eyebrow">{t.home.eyebrow}</p>
              <h1 className="screen-heading mt-2">{t.home.title}</h1>
            </div>
            <div className="shrink-0 rounded-2xl border border-border-soft bg-surface px-3 py-2.5 text-right">
              <p className="eyebrow">{t.home.onlineNow}</p>
              <p className="mt-1 font-display text-2xl leading-none tracking-tight text-foreground">
                {liveStats.onlineNow}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {locale === "fr" ? "Vous entrez comme" : "You enter as"}{" "}
            <span className="text-foreground/80">{identity.alias}</span>
          </p>
        </div>

        {/* Mode grid — 2×2 flex, no carousel */}
        <div className="glass-panel p-4">
          <p className="eyebrow mb-3">{locale === "fr" ? "Modes" : "Modes"}</p>
          <div className="grid grid-cols-2 gap-2">
            {LIVE_MODES.map((modeId) => {
              const mode = MODE_CONFIG[modeId];
              return (
                <Link
                  key={modeId}
                  href={`/start` as "/start"}
                  className="flex flex-col gap-2 rounded-xl border border-border-soft bg-surface p-3.5 transition hover:bg-surface-strong active:scale-[0.97]"
                >
                  <span className="text-xl leading-none">{mode.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{mode.name}</p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                      {mode.shortLabel}
                    </p>
                  </div>
                  <span className="eyebrow self-start">{mode.cadence}</span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/start"
            className="mt-3 flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition"
          >
            {t.home.launchCta}
          </Link>
        </div>

        {/* Quote of the day */}
        <HomeQuoteCard locale={locale} quote={quote} />

        {/* Reconnects preview */}
        <div className="glass-panel p-4">
          <p className="eyebrow">{t.home.reconnectsEyebrow}</p>
          <h2 className="mt-2 font-display text-xl leading-tight tracking-tight text-foreground">
            {t.home.reconnectsTitle}
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.home.reconnectsBody}</p>
          <div className="mt-3 space-y-2">
            {mockReconnects.slice(0, 2).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-border-soft bg-surface px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{r.displayName}</p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                    {translateSampleText(r.lastTopic, locale)}
                  </p>
                </div>
                <span className="eyebrow shrink-0">
                  {translateReconnectStatus(r.status, locale)}
                </span>
              </div>
            ))}
          </div>
          <Link href="/reconnects" className="soft-link mt-3 inline-block text-xs">
            {t.home.reconnectsLink}
          </Link>
        </div>

        {/* Safety */}
        <div className="glass-panel p-4">
          <p className="eyebrow">{t.home.safetyEyebrow}</p>
          <h2 className="mt-2 font-display text-xl leading-tight tracking-tight text-foreground">
            {t.home.safetyTitle}
          </h2>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.home.safetyBody}</p>
          <div className="mt-3 space-y-2">
            {t.home.safetyRules.map((rule) => (
              <p
                key={rule}
                className="rounded-xl border border-border-soft bg-surface px-3 py-2.5 text-xs leading-5 text-muted-foreground"
              >
                {rule}
              </p>
            ))}
          </div>
        </div>

        <div className="h-2" />
      </div>
    </AppShell>
  );
}
