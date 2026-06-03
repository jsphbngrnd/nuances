"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getInitials } from "@/lib/utils";
import { TranscriptBubble } from "@/components/transcript-bubble";
import {
  autonomousConversations,
  autonomousDemoPersonas,
} from "@/lib/autonomous-demo";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AutonomousDemo({ locale }: { locale: Locale }) {
  const [conversationId, setConversationId] = useState("autonomous-debate-ai");
  const [visibleCount, setVisibleCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typingSpeakerId, setTypingSpeakerId] = useState<string | null>(null);
  const endOfTranscriptRef = useRef<HTMLDivElement | null>(null);

  const conversation = useMemo(
    () =>
      autonomousConversations.find((item) => item.id === conversationId) ??
      autonomousConversations[0],
    [conversationId]
  );

  const groupedConversations = useMemo(() => {
    const order = ["debate", "funny", "deep", "late-night"] as const;

    return order
      .map((mode) => ({
        mode,
        items: autonomousConversations.filter((item) => item.mode === mode),
      }))
      .filter((group) => group.items.length > 0);
  }, []);

  useEffect(() => {
    setVisibleCount(1);
    setIsPlaying(true);
    setTypingSpeakerId(null);
  }, [conversationId]);

  useEffect(() => {
    if (!conversation || !isPlaying) return;
    if (visibleCount >= conversation.messages.length) return;

    const currentMessage = conversation.messages[visibleCount - 1];
    const nextMessage = conversation.messages[visibleCount];
    const wordCount = currentMessage?.content.split(/\s+/).filter(Boolean).length ?? 0;
    const readingDelay = Math.min(3800, Math.max(1500, wordCount * 55));
    const preTypingDelay =
      visibleCount === 1
        ? 1100
        : currentMessage?.sourceType === "system"
          ? 1500
          : readingDelay;
    const typingDelay =
      nextMessage?.sourceType === "system"
        ? 0
        : Math.min(
            1200,
            Math.max(
              650,
              (nextMessage?.content.split(/\s+/).filter(Boolean).length ?? 0) * 22
            )
          );

    const typingTimer = window.setTimeout(() => {
      if (nextMessage?.sourceType !== "system" && nextMessage?.userId !== "system") {
        setTypingSpeakerId(nextMessage.userId);
      }
    }, preTypingDelay);

    const revealTimer = window.setTimeout(() => {
      setTypingSpeakerId(null);
      setVisibleCount((count) => Math.min(count + 1, conversation.messages.length));
    }, preTypingDelay + typingDelay);

    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(revealTimer);
    };
  }, [conversation, isPlaying, visibleCount]);

  useEffect(() => {
    if (!endOfTranscriptRef.current) return;

    endOfTranscriptRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [typingSpeakerId, visibleCount]);

  if (!conversation) return null;

  const visibleMessages = conversation.messages.slice(0, visibleCount);
  const rightAlignedSpeakerId = conversation.participants[1]?.id;
  const typingPersona = conversation.participants.find(
    (persona) => persona.id === typingSpeakerId
  );

  return (
    <div className="screen-stack">
      <section className="screen-header">
        <p className="eyebrow mt-3">
          {locale === "fr" ? "Démo autonome" : "Autonomous demo"}
        </p>
        <h1 className="screen-heading mt-3 max-w-[12ch]">
          {locale === "fr"
            ? "Plusieurs modes. Plusieurs manières de faire parler la room."
            : "Multiple modes. Multiple ways to make the room speak."}
        </h1>
        <p className="mt-4 max-w-[34ch] text-sm leading-6 text-ink/78">
          {locale === "fr"
            ? "Chaque persona a sa manière de penser, d'écrire et de relancer. Lance différentes scènes pour voir comment NUANCE se comporte selon le mode."
            : "Each persona has a different way of thinking, writing, and pushing the room forward. Launch different scenes to watch NUANCE behave across modes."}
        </p>
      </section>

      <section className="screen-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">
              {locale === "fr" ? "Casting" : "Casting"}
            </p>
            <h2 className="mt-3 app-section-title">
              {locale === "fr" ? "Les quatre voix" : "The four voices"}
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs uppercase tracking-[0.22em] text-ink/62">
            {locale === "fr" ? "Autoplay" : "Autoplay"}
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {autonomousDemoPersonas.map((persona) => (
            <article
              key={persona.id}
              className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-[1.55rem] leading-none tracking-[-0.04em] text-ink">
                    {persona.displayName}
                  </h3>
                  <p className="eyebrow mt-2">{persona.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/46">
                    {locale === "fr" ? "Voix" : "Voice"}
                  </p>
                  <p className="mt-2 max-w-[20ch] text-sm leading-5 text-ink/68">
                    {persona.voice}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/46">
                    {locale === "fr" ? "Vision" : "Worldview"}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-ink/72">
                    {persona.worldview}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/46">
                    {locale === "fr" ? "Écriture" : "Writing"}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-ink/72">
                    {persona.writingStyle}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/46">
                    {locale === "fr" ? "Move" : "Move"}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-ink/72">
                    {persona.favoriteMove}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="screen-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">
              {locale === "fr" ? "Room autonome" : "Autonomous room"}
            </p>
            <h2 className="mt-3 app-section-title">{conversation.topic}</h2>
            <p className="mt-3 max-w-[34ch] text-sm leading-6 text-ink/72">
              {conversation.setup}
            </p>
            <p className="mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-ink/46">
              {conversation.participants.map((persona) => persona.displayName).join(" / ")}
            </p>
          </div>
          <div className="grid gap-3">
            {groupedConversations.map((group) => (
              <div key={group.mode} className="flex flex-wrap items-center justify-end gap-2">
                <span className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/42">
                  {group.mode === "debate"
                    ? "Debate"
                    : group.mode === "funny"
                      ? "Funny"
                      : group.mode === "deep"
                        ? "Deep"
                        : "Late Night"}
                </span>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConversationId(item.id)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs uppercase tracking-[0.2em] transition",
                      item.id === conversationId
                        ? "border-black/10 bg-black text-white"
                        : "border-white/10 bg-white/6 text-ink/72 hover:bg-white/10"
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-white/6 px-4 py-3">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/46">
              {locale === "fr" ? "Statut" : "Status"}
            </p>
            <p className="mt-2 text-sm leading-5 text-ink/72">
              {visibleCount >= conversation.messages.length
                ? locale === "fr"
                  ? "La conversation a joué jusqu'au bout."
                  : "The conversation played to the end."
                : locale === "fr"
                  ? "La room avance toute seule, message après message."
                  : "The room is moving on its own, one message at a time."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((value) => !value)}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-ink transition hover:bg-white/10"
            >
              {isPlaying
                ? locale === "fr"
                  ? "Pause"
                  : "Pause"
                : locale === "fr"
                  ? "Relancer"
                  : "Resume"}
            </button>
            <button
              type="button"
              onClick={() => {
                setVisibleCount(1);
                setIsPlaying(true);
              }}
              className="rounded-full border border-black/10 bg-black px-4 py-2 text-sm text-white transition hover:opacity-90"
            >
              {locale === "fr" ? "Rejouer" : "Replay"}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {visibleMessages.map((message) => (
            <TranscriptBubble
              key={message.id}
              message={message}
              isOwn={message.userId !== "system" && message.userId === rightAlignedSpeakerId}
            />
          ))}
          {typingPersona ? (
            <div
              className={cn(
                "flex items-end gap-3",
                typingPersona.id === rightAlignedSpeakerId
                  ? "justify-end"
                  : "justify-start"
              )}
            >
              {typingPersona.id !== rightAlignedSpeakerId ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs uppercase tracking-[0.2em] text-ink/72">
                  {getInitials(typingPersona.displayName)}
                </div>
              ) : null}
              <div
                className={cn(
                  "rounded-[26px] px-4 py-3",
                  typingPersona.id === rightAlignedSpeakerId
                    ? "rounded-br-md bg-bone text-fog"
                    : "rounded-bl-md border border-white/10 bg-white/6 text-ink"
                )}
              >
                <div className="mb-2 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] opacity-65">
                  <span>{typingPersona.displayName}</span>
                  <span>{locale === "fr" ? "Écrit" : "Typing"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-current opacity-50" />
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-current opacity-65"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-current opacity-80"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div ref={endOfTranscriptRef} />
        </div>

        {visibleCount >= conversation.messages.length ? (
          <div className="mt-8 rounded-[26px] border border-white/10 bg-white/6 p-5">
            <p className="eyebrow">{conversation.recap.eyebrow}</p>
            <h3 className="mt-3 font-display text-[1.8rem] leading-[0.96] tracking-[-0.04em] text-ink">
              {conversation.recap.title}
            </h3>
            <p className="mt-4 max-w-[34ch] text-sm leading-6 text-ink/74">
              {conversation.recap.summary}
            </p>
            <div className="mt-5 grid gap-3">
              {conversation.recap.points.map((point) => (
                <div
                  key={point}
                  className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-ink/72"
                >
                  {point}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-ink/68">
              {conversation.recap.closing}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
