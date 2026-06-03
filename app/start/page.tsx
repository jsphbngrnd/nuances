import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { StartLiveModeCard } from "@/components/start-live-mode-card";
import {
  FUTURE_EXCHANGE_CATALOG,
  LIVE_EXCHANGE_CATALOG,
  localizeModeList,
  localizeModeText,
} from "@/lib/modes";
import { getLocale } from "@/lib/server-locale";

export default async function StartPage() {
  const locale = await getLocale();
  const isFrench = locale === "fr";

  const copy = isFrench
    ? {
        eyebrow: "Start",
        title: "Comment voulez-vous vous connecter ce soir ?",
        body:
          "Choisissez d'abord le type d'échange. Le matching se charge ensuite de trouver la bonne personne disponible maintenant.",
        liveEyebrow: "Disponibles maintenant",
        liveTitle: "Les modes du MVP",
        liveBody:
          "Ces expériences live sont prêtes à être lancées maintenant, avec matching, sujet, room, résumé et recontact.",
        futureEyebrow: "Bientôt",
        futureTitle: "Formats à venir",
        futureBody:
          "Ces formats restent visibles pour donner la direction produit, mais ils ne sont pas encore activés dans le prototype.",
        liveStatus: "Disponible",
        futureStatus: "Bientôt",
        duration: "Durée",
        structure: "Structure",
        promptCategory: "Catégorie de prompts",
        emotionalTone: "Tonalité",
        reconnect: "Recontact",
        aiSummary: "Résumé IA",
        prompts: "Exemples",
        cta: "Lancer ce mode",
        topCta: "Lancer un débat maintenant",
        showDetails: "Voir les détails",
        hideDetails: "Masquer les détails",
      }
    : {
        eyebrow: "Start",
        title: "How do you want to connect tonight?",
        body:
          "Choose the exchange type first. Matchmaking then finds the right available person for that room.",
        liveEyebrow: "Available now",
        liveTitle: "The MVP modes",
        liveBody:
          "These live experiences are ready now, complete with matchmaking, topic acceptance, live room, summary, and reconnect.",
        futureEyebrow: "Coming soon",
        futureTitle: "Next exchange formats",
        futureBody:
          "These formats stay visible to show the product direction, but they are not live in the prototype yet.",
        liveStatus: "Live",
        futureStatus: "Soon",
        duration: "Duration",
        structure: "Structure",
        promptCategory: "Prompt category",
        emotionalTone: "Emotional tone",
        reconnect: "Reconnect",
        aiSummary: "AI summary",
        prompts: "Examples",
        cta: "Launch this mode",
        topCta: "Start a debate now",
        showDetails: "Show details",
        hideDetails: "Hide details",
      };

  return (
    <AppShell
      locale={locale}
      currentNav="/start"
      header={
        <header className="screen-header">
          <p className="eyebrow mt-3">{copy.eyebrow}</p>
          <h1 className="screen-heading mt-3">{copy.title}</h1>
          <p className="mt-4 max-w-[31ch] text-sm leading-6 text-ink/78">{copy.body}</p>
        </header>
      }
    >
      <section className="screen-stack">
        <article className="screen-card">
          <p className="eyebrow mt-3">{copy.liveEyebrow}</p>
          <h2 className="mt-3 app-section-title">{copy.liveTitle}</h2>
          <p className="mt-4 text-sm leading-6 text-ink/76">{copy.liveBody}</p>
          <div className="mt-5">
            <Link
              href="/matchmaking?mode=debate"
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {copy.topCta}
            </Link>
          </div>
        </article>

        {LIVE_EXCHANGE_CATALOG.map((item) => {
          return (
            <StartLiveModeCard
              key={item.id}
              item={item}
              locale={locale}
              copy={copy}
            />
          );
        })}

        <article className="screen-card">
          <p className="eyebrow mt-3">{copy.futureEyebrow}</p>
          <h2 className="mt-3 app-section-title">{copy.futureTitle}</h2>
          <p className="mt-4 text-sm leading-6 text-ink/76">{copy.futureBody}</p>
        </article>

        <div className="grid gap-4">
          {FUTURE_EXCHANGE_CATALOG.map((item) => {
            const title = localizeModeText(locale, item.title);
            const description = localizeModeText(locale, item.description);
            const duration = localizeModeText(locale, item.duration);
            const promptCategory = localizeModeText(locale, item.promptCategory);
            const emotionalTone = localizeModeText(locale, item.emotionalTone);

            return (
              <article
                key={item.id}
                className={`glass-panel overflow-hidden bg-gradient-to-br p-6 opacity-70 ${item.gradientClass}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">{copy.futureStatus}</p>
                    <h3
                      className={`mt-3 font-display leading-none tracking-[-0.04em] text-white ${
                        item.id === "late-night" ? "whitespace-nowrap text-[1.72rem]" : "text-[1.9rem]"
                      }`}
                    >
                      <span className="mr-2">{item.emoji}</span>
                      {title}
                    </h3>
                  </div>
                  <span className="eyebrow text-right">
                    {duration}
                  </span>
                </div>

                <p className="mt-4 max-w-[34ch] text-[0.84rem] leading-[1.22rem] text-ink/58">
                  {description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] border border-white/10 bg-black/24 p-4">
                    <p className="eyebrow">{copy.promptCategory}</p>
                    <p className="mt-3 text-sm leading-5 text-ink/70">{promptCategory}</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-black/24 p-4">
                    <p className="eyebrow">{copy.emotionalTone}</p>
                    <p className="mt-3 text-sm leading-5 text-ink/70">{emotionalTone}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
