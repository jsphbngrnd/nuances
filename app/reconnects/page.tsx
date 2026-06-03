import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { mockReconnects } from "@/lib/mock-data";
import { localizeRecommendationType, selectReconnectRecommendation } from "@/lib/recommendations";
import { getCopy, translateReconnectStatus, translateSampleText } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";
import type { ConversationMode } from "@/lib/types";

function parseReconnectMode(value: string): ConversationMode {
  if (value.toLowerCase().includes("debate") || value.toLowerCase().includes("débat")) return "debate";
  if (value.toLowerCase().includes("deep")) return "deep";
  return "late-night";
}

export default async function ReconnectsPage() {
  const locale = await getLocale();
  const t = getCopy(locale);
  const continueWithLabel =
    locale === "fr" ? "Continuer cette conversation avec" : "Continue this conversation with";
  const openLabel = locale === "fr" ? "Ouvrir" : "Open";

  return (
    <AppShell
      locale={locale}
      currentNav="/reconnects"
      header={
        <header className="screen-header">
          <h1 className="screen-heading mt-4">{t.reconnects.title}</h1>
          <p className="eyebrow mt-3">{t.reconnects.eyebrow}</p>
          <p className="mt-4 max-w-[32ch] text-sm leading-6 text-ink/78">
            {t.reconnects.body}
          </p>
        </header>
      }
    >
      <section className="screen-stack">
        {mockReconnects.map((reconnect) => (
          (() => {
            const mode = parseReconnectMode(reconnect.mode);
            const sharedRecommendation = selectReconnectRecommendation({
              mode,
              topicText: reconnect.lastTopic,
            });

            return (
              <article key={reconnect.id} className="screen-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="mt-3 app-section-title text-[2.05rem]">
                      {reconnect.displayName}
                    </h2>
                    <p className="eyebrow mt-3">{reconnect.mode}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/24 px-3 py-2 text-xs uppercase tracking-[0.22em] text-ink/70">
                    {translateReconnectStatus(reconnect.status, locale)}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-ink/76">
                  {translateSampleText(reconnect.lastTopic, locale)}
                </p>

                {sharedRecommendation ? (
                  <div className="mt-5 rounded-[22px] border border-white/10 bg-black/24 p-4">
                    <p className="eyebrow">{continueWithLabel}</p>
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-stone">
                          {localizeRecommendationType(sharedRecommendation.type, locale)}
                        </p>
                        <p className="mt-2 text-base text-white">{sharedRecommendation.title}</p>
                        <p className="mt-2 text-sm leading-5 text-ink/68">
                          {sharedRecommendation.shortDescription}
                        </p>
                      </div>
                      <a
                        href={sharedRecommendation.affiliateUrl ?? sharedRecommendation.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-fog transition hover:bg-[#f3ecff]"
                      >
                        {openLabel}
                      </a>
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-stone">{reconnect.lastMet}</span>
                  <Link href={`/matchmaking?mode=${mode}`} className="soft-link">
                    {t.reconnects.reopen}
                  </Link>
                </div>
              </article>
            );
          })()
        ))}
      </section>
    </AppShell>
  );
}
