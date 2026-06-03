"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getModeName, translateSampleText } from "@/lib/i18n";
import type { ConversationMode, ConversationTopic } from "@/lib/types";
import type { ModeDefinition } from "@/lib/types";

export function TopicAcceptanceClient({
  locale,
  mode,
  modeKey,
  roomId,
  topics,
  labels,
}: {
  locale: Locale;
  mode: ModeDefinition;
  modeKey: ConversationMode;
  roomId: string;
  topics: ConversationTopic[];
  labels: {
    eyebrow: string;
    title: string;
    body: string;
    accept: string;
    reroll: string;
  };
}) {
  const [topicIndex, setTopicIndex] = useState(0);
  const [rerollCount, setRerollCount] = useState(0);
  const selectedTopic = topics[topicIndex] ?? topics[0];
  const rerollsRemaining = Math.max(0, 2 - rerollCount);

  const helperText = useMemo(() => {
    if (rerollCount >= 2) {
      return locale === "fr"
        ? "Limite atteinte. Vous pouvez accepter ce sujet ou repartir vers un nouveau match."
        : "Reroll limit reached. Accept this topic or go back for a new match.";
    }

    return locale === "fr"
      ? `${rerollsRemaining} renouvellement${rerollsRemaining > 1 ? "s" : ""} restant${rerollsRemaining > 1 ? "s" : ""}.`
      : `${rerollsRemaining} reroll${rerollsRemaining > 1 ? "s" : ""} remaining.`;
  }, [locale, rerollCount, rerollsRemaining]);

  function handleReroll() {
    if (rerollCount >= 2 || topics.length <= 1) return;

    setTopicIndex((current) => (current + 1) % topics.length);
    setRerollCount((current) => current + 1);
  }

  return (
    <section className="screen-card">
      <h1 className="screen-heading mt-4">{labels.title}</h1>
      <p className="eyebrow mt-3">{labels.eyebrow}</p>

      <div className="mt-8 rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
        <h2 className="mt-4 font-display text-[2.8rem] leading-[0.94] tracking-[-0.05em] text-white">
          {translateSampleText(selectedTopic.text, locale)}
        </h2>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-stone">
          {mode.emoji} {getModeName(modeKey, locale)}
        </p>
        <p className="mt-5 max-w-[30ch] text-sm leading-6 text-ink/76">{labels.body}</p>
      </div>

      <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-ink/88">
        {helperText}
      </div>

      <div className="mt-8 grid gap-3">
        <Link
          href={`/room/${roomId}?topic=${selectedTopic.id}`}
          className="rounded-full bg-bone px-5 py-4 text-center text-sm font-semibold text-fog"
        >
          {labels.accept}
        </Link>

        {rerollCount < 2 ? (
          <button
            type="button"
            onClick={handleReroll}
            className="rounded-full border border-white/15 bg-white/[0.12] px-5 py-4 text-sm font-medium text-white transition hover:border-bone hover:bg-bone hover:text-fog"
          >
            {labels.reroll}
          </button>
        ) : (
          <Link
            href={`/matchmaking?mode=${modeKey}`}
            className="rounded-full border border-white/20 bg-black/45 px-5 py-4 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-fog"
          >
            {locale === "fr" ? "Trouver une autre personne" : "Find another match"}
          </Link>
        )}
      </div>
    </section>
  );
}
