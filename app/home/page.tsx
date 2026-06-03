import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { HomeQuoteCard } from "@/components/home-quote-card";
import { getConversationQuoteOfTheDay, liveStats, mockReconnects } from "@/lib/mock-data";
import { getCopy, translateReconnectStatus, translateSampleText } from "@/lib/i18n";
import { getCurrentIdentity } from "@/lib/server-identity";
import { getLocale } from "@/lib/server-locale";

export default async function HomePage() {
  const locale = await getLocale();
  const identity = await getCurrentIdentity();
  const t = getCopy(locale);
  const modeListLabel = locale === "fr" ? "Débat / Funny / Deep / Late Night" : "Debate / Funny / Deep / Late Night";
  const quote = getConversationQuoteOfTheDay(locale);

  return (
    <AppShell
      locale={locale}
      currentNav="/home"
      header={
        <header className="screen-header">
          <div className="mt-4 app-topbar">
            <div>
              <h1 className="screen-heading">{t.home.title}</h1>
              <p className="eyebrow mt-3">{t.home.eyebrow}</p>
              <p className="mt-4 max-w-[30ch] text-sm leading-6 text-ink/78">
                {t.home.body}
              </p>
              <p className="mt-3 text-[0.72rem] uppercase tracking-[0.22em] text-ink/46">
                {locale === "fr" ? "Vous entrez comme" : "You enter as"} {identity.alias}
              </p>
            </div>
            <div className="app-metric">
              <p className="eyebrow">{t.home.onlineNow}</p>
              <p className="mt-2 app-metric-value">{liveStats.onlineNow}</p>
            </div>
          </div>
        </header>
      }
    >
      <div className="screen-stack">
        <section className="grid gap-4">
          <article className="screen-card overflow-hidden">
            <div className="launch-panel relative overflow-hidden rounded-[26px] p-5">
              <div className="relative">
                <h2 className="mt-3 app-section-title">{t.home.launchTitle}</h2>
                <p className="eyebrow mt-3">{t.home.launchEyebrow}</p>
                <p className="mt-4 max-w-[30ch] text-[0.82rem] leading-[1.18rem] text-ink/60">
                  {t.home.launchBody}
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-ink/54">
                    {modeListLabel}
                  </span>
                  <Link
                    href="/start"
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-fog shadow-[0_12px_36px_rgba(255,255,255,0.08)] transition hover:bg-[#f3ecff]"
                  >
                    {t.home.launchCta}
                  </Link>
                </div>
              </div>
            </div>
          </article>

          <article className="screen-card">
            <p className="eyebrow mt-1">
              {locale === "fr" ? "Démo autonome" : "Autonomous demo"}
            </p>
            <h2 className="mt-3 app-section-title">
              {locale === "fr"
                ? "Quatre personas parlent entre eux."
                : "Four personas talk to each other."}
            </h2>
            <p className="mt-4 max-w-[31ch] text-sm leading-6 text-ink/72">
              {locale === "fr"
                ? "Ouvre une room autonome avec quatre personnalités distinctes pour montrer immédiatement le produit en action."
                : "Open an autonomous room with four distinct personalities so the product can demo itself instantly."}
            </p>
            <div className="mt-5">
              <Link
                href="/demo"
                className="rounded-full border border-black/10 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {locale === "fr" ? "Lancer la démo autonome" : "Launch autonomous demo"}
              </Link>
            </div>
          </article>

          <HomeQuoteCard locale={locale} quote={quote} />

          <article className="screen-card">
            <h2 className="mt-3 app-section-title">{t.home.reconnectsTitle}</h2>
            <p className="eyebrow mt-3">{t.home.reconnectsEyebrow}</p>
            <p className="mt-3 text-sm leading-6 text-ink/78">
              {t.home.reconnectsBody}
            </p>
            <div className="mt-5 space-y-3">
              {mockReconnects.slice(0, 2).map((reconnect) => (
                <div key={reconnect.id} className="rounded-[22px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base text-ink">{reconnect.displayName}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-stone">
                      {translateReconnectStatus(reconnect.status, locale)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink/72">
                    {translateSampleText(reconnect.lastTopic, locale)}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/reconnects" className="soft-link mt-5 inline-block">
              {t.home.reconnectsLink}
            </Link>
          </article>

          <article className="screen-card">
            <h2 className="mt-3 app-section-title">{t.home.safetyTitle}</h2>
            <p className="eyebrow mt-3">{t.home.safetyEyebrow}</p>
            <p className="mt-3 text-sm leading-6 text-ink/78">
              {t.home.safetyBody}
            </p>
            <div className="mt-5 grid gap-3">
              {t.home.safetyRules.map((rule) => (
                <div key={rule} className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-ink/76">
                  {rule}
                </div>
              ))}
            </div>
            <Link href="/settings" className="soft-link mt-5 inline-block">
              {t.home.safetyLink}
            </Link>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
