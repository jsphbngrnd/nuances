"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDemoRoomById, mockSummary, mockTranscript, mockTopics, mockUsers } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import { buildDemoIntro } from "@/lib/demo-simulator";
import {
  localizeSemanticTag,
  localizeRecommendationType,
  readSavedRecommendations,
  selectGoFurtherRecommendations,
  toggleSavedRecommendation,
  trackRecommendationEvent,
} from "@/lib/recommendations";
import { buildRoomSummary } from "@/lib/summary";
import { readDemoConversation } from "@/lib/demo-storage";
import type { RoomSummary } from "@/lib/types";

type SummaryLabels = {
  eyebrow: string;
  title: string;
  sharedThemes: string;
  agreementPoints: string;
  reconnect: string;
  talkAgain: string;
  nextPerson: string;
  reflection: string;
  reflectionQuestion: string;
  reflectionOptions: string[];
  disagreementPoints: string;
  emotionalTone: string;
  semanticTags: string;
  goFurther: string;
  goFurtherBody: string;
  saveItem: string;
  savedItem: string;
  openItem: string;
  sponsored: string;
};

type SummarySource = "live" | "fallback";

export function SummaryClient({
  roomId,
  locale,
  labels,
}: {
  roomId: string;
  locale: Locale;
  labels: SummaryLabels;
}) {
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [resolvedSummary, setResolvedSummary] = useState<RoomSummary | null>(null);
  const [summarySource, setSummarySource] = useState<SummarySource>("fallback");
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    setSavedItems(readSavedRecommendations());
  }, []);

  const conversation = useMemo(() => {
    const stored = readDemoConversation(roomId);

    if (!stored) {
      const room = getDemoRoomById(roomId);
      const fallbackMessages = mockTranscript.filter((message) => message.roomId === roomId);

      if (!room) {
        return {
          mode: "late-night" as const,
          topicText: "",
          messages: mockTranscript.filter((message) => message.roomId === roomId),
          summary: mockSummary,
        };
      }

      const topicText = mockTopics.find((topic) => topic.id === room.topicId)?.text ?? "";
      const synthesizedMessages = fallbackMessages.length
        ? fallbackMessages
        : buildDemoIntro(room.id, locale, room.mode, mockUsers[1], topicText);

      return {
        mode: room.mode,
        topicText,
        messages: synthesizedMessages,
        summary: buildRoomSummary(
          room.id,
          room.mode,
          synthesizedMessages,
          topicText,
          locale
        ),
      };
    }

    return {
      mode: stored.mode,
      topicText: stored.topicText,
      messages: stored.messages,
      summary: buildRoomSummary(roomId, stored.mode, stored.messages, stored.topicText, locale),
    };
  }, [locale, roomId]);

  useEffect(() => {
    let isCancelled = false;

    async function resolveSummary() {
      setIsSummaryLoading(true);
      setResolvedSummary(conversation.summary);
      setSummarySource("fallback");

      try {
        const response = await fetch(`/api/rooms/${roomId}/summary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locale,
            mode: conversation.mode,
            topicText: conversation.topicText,
            messages: conversation.messages,
          }),
        });

        if (!response.ok) {
          throw new Error(`Summary route returned ${response.status}`);
        }

        const payload = (await response.json()) as {
          summary?: RoomSummary;
          usedFallback?: boolean;
        };

        if (isCancelled || !payload.summary) return;

        setResolvedSummary(payload.summary);
        setSummarySource(payload.usedFallback ? "fallback" : "live");
      } catch {
        if (isCancelled) return;
        setResolvedSummary(conversation.summary);
        setSummarySource("fallback");
      } finally {
        if (!isCancelled) {
          setIsSummaryLoading(false);
        }
      }
    }

    void resolveSummary();

    return () => {
      isCancelled = true;
    };
  }, [conversation.mode, conversation.summary, conversation.topicText, locale, roomId]);

  const activeSummary = resolvedSummary ?? conversation.summary;

  const recommendations = useMemo(
    () =>
      selectGoFurtherRecommendations({
        mode: conversation.mode,
        topicText: conversation.topicText,
        summary: activeSummary,
      }),
    [activeSummary, conversation.mode, conversation.topicText]
  );

  const reactionQuestion =
    conversation.mode === "funny"
      ? locale === "fr"
        ? "Quel camp a le mieux tenu sa take ?"
        : "Which side actually landed the better take?"
      : labels.reflectionQuestion;

  const reactionLabel =
    conversation.mode === "funny"
      ? locale === "fr"
        ? "Vote express"
        : "Quick vote"
      : labels.reflection;

  const reactionOptions =
    conversation.mode === "funny"
      ? locale === "fr"
        ? ["D'accord", "Pas d'accord", "Indécis", "Take la plus drôle"]
        : ["Agree", "Disagree", "Undecided", "Funniest take"]
      : labels.reflectionOptions;

  function handleRecommendationSave(recommendationId: string) {
    setSavedItems(toggleSavedRecommendation(recommendationId));
  }

  function handleRecommendationClick(recommendationId: string) {
    trackRecommendationEvent({
      recommendationId,
      roomId,
      action: "click",
    });
  }

  return (
    <section className="screen-card">
      <h1 className="screen-heading mt-4">{labels.title}</h1>
      <p className="eyebrow mt-3">{labels.eyebrow}</p>
      <p className="mt-4 text-sm leading-6 text-ink/78">{activeSummary.summaryText}</p>
      <p className="mt-3 text-[0.72rem] uppercase tracking-[0.22em] text-stone">
        {isSummaryLoading
          ? locale === "fr"
            ? "Résumé IA en cours..."
            : "AI summary loading..."
          : summarySource === "live"
            ? locale === "fr"
              ? "Résumé généré par l'IA à partir du transcript réel"
              : "Summary generated by AI from the real transcript"
            : locale === "fr"
              ? "Résumé de fallback du prototype"
              : "Prototype fallback summary"}
      </p>

      <div className="mt-8 grid gap-4">
        <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="eyebrow">{labels.sharedThemes}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeSummary.mainThemes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border border-white/10 bg-black/24 px-3 py-2 text-sm text-ink/80"
              >
                {theme}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="eyebrow">{labels.semanticTags}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeSummary.semanticTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/24 px-3 py-2 text-sm text-ink/76"
              >
                {localizeSemanticTag(tag, locale)}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="eyebrow">{labels.agreementPoints}</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/76">
            {activeSummary.agreementPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>

        {activeSummary.disagreementPoints.length ? (
          <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
            <p className="eyebrow">{labels.disagreementPoints}</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/76">
              {activeSummary.disagreementPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ) : null}

        <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
          <p className="eyebrow">{labels.emotionalTone}</p>
          <p className="mt-3 text-lg text-ink">{activeSummary.emotionalTone}</p>
        </article>

        {activeSummary.followUpQuestion ? (
          <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
            <p className="eyebrow">{labels.reconnect}</p>
            <p className="mt-3 text-lg text-ink">{activeSummary.followUpQuestion}</p>
          </article>
        ) : null}

        {recommendations.length ? (
          <article className="rounded-[24px] border border-white/10 bg-white/6 p-4">
            <h2 className="mt-3 app-section-title text-[2rem]">{labels.goFurther}</h2>
            <p className="eyebrow mt-3">{conversation.topicText || labels.goFurther}</p>
            <p className="mt-4 max-w-[34ch] text-[0.84rem] leading-[1.22rem] text-ink/60">
              {labels.goFurtherBody}
            </p>

            <div className="mt-5 grid gap-3">
              {recommendations.map((recommendation) => {
                const isSaved = savedItems.includes(recommendation.id);
                const destination = recommendation.affiliateUrl ?? recommendation.url;

                return (
                  <article
                    key={recommendation.id}
                    className="rounded-[22px] border border-white/10 bg-black/24 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs uppercase tracking-[0.22em] text-stone">
                            {localizeRecommendationType(recommendation.type, locale)}
                          </span>
                          {recommendation.sponsorLabel ? (
                            <span className="rounded-full border border-white/10 bg-white/[0.08] px-2 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-ink/68">
                              {labels.sponsored}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 text-lg text-white">{recommendation.title}</h3>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-ink/74">
                      {recommendation.shortDescription}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {recommendation.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-ink/66"
                        >
                          {localizeSemanticTag(tag, locale)}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleRecommendationSave(recommendation.id)}
                        className="rounded-full border border-white/15 bg-white/[0.1] px-4 py-2 text-sm font-medium text-white transition hover:border-bone hover:bg-bone hover:text-fog"
                      >
                        {isSaved ? labels.savedItem : labels.saveItem}
                      </button>

                      <a
                        href={destination}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleRecommendationClick(recommendation.id)}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-fog transition hover:bg-[#f3ecff]"
                      >
                        {labels.openItem}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        ) : null}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link
          href="/reconnects"
          className="rounded-full bg-bone px-5 py-4 text-center text-sm font-semibold text-fog"
        >
          {labels.talkAgain}
        </Link>
        <Link
          href="/start"
          className="rounded-full border border-white/15 bg-white/[0.12] px-5 py-4 text-center text-sm font-medium text-white transition hover:border-bone hover:bg-bone hover:text-fog"
        >
          {labels.nextPerson}
        </Link>
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-4">
        <p className="eyebrow">{reactionLabel}</p>
        <p className="mt-3 text-sm text-ink/76">{reactionQuestion}</p>
        <div className={`mt-4 grid gap-3 ${reactionOptions.length > 3 ? "grid-cols-2" : "grid-cols-3"}`}>
          {reactionOptions.map((item) => (
            <button
              key={item}
              className="rounded-full border border-white/15 bg-white/[0.1] px-4 py-3 text-sm font-medium text-ink/90 transition hover:border-bone hover:bg-bone hover:text-fog"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
