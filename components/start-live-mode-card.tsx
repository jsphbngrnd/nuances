"use client";

import { useState } from "react";
import Link from "next/link";
import { localizeModeList, localizeModeText, type ExchangeCatalogItem } from "@/lib/modes";
import type { Locale } from "@/lib/i18n";

export function StartLiveModeCard({
  item,
  locale,
  copy,
}: {
  item: ExchangeCatalogItem;
  locale: Locale;
  copy: {
    liveStatus: string;
    duration: string;
    structure: string;
    promptCategory: string;
    emotionalTone: string;
    reconnect: string;
    aiSummary: string;
    prompts: string;
    cta: string;
    showDetails: string;
    hideDetails: string;
  };
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const title = localizeModeText(locale, item.title);
  const description = localizeModeText(locale, item.description);
  const duration = localizeModeText(locale, item.duration);
  const promptCategory = localizeModeText(locale, item.promptCategory);
  const emotionalTone = localizeModeText(locale, item.emotionalTone);
  const reconnect = localizeModeText(locale, item.reconnectOption);
  const aiSummary = localizeModeText(locale, item.aiSummary);
  const structure = localizeModeList(locale, item.structure);
  const prompts = localizeModeList(locale, item.prompts);

  return (
    <article className={`glass-panel overflow-hidden bg-gradient-to-br p-6 ${item.gradientClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-[22rem]">
          <p className="eyebrow">{copy.liveStatus}</p>
          <h2
            className={`mt-3 font-display leading-[0.94] tracking-[-0.04em] text-white ${
              item.id === "late-night" ? "whitespace-nowrap text-[1.95rem]" : "text-[2.15rem]"
            }`}
          >
            <span className="mr-2">{item.emoji}</span>
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="eyebrow text-right">
            {duration}
          </span>
        </div>
      </div>

      <p className="mt-4 max-w-[34ch] text-[0.84rem] leading-[1.22rem] text-ink/62">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {item.mode ? (
            <Link
              href={`/matchmaking?mode=${item.mode}`}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-fog transition hover:bg-[#f3ecff]"
            >
              <span className="inline-flex items-center gap-1.5">
                <span>Go</span>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path
                    d="M7 12h10M13 7l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setDetailsOpen((value) => !value)}
            className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
          >
            {detailsOpen ? copy.hideDetails : copy.showDetails}
          </button>
        </div>
      </div>

      {detailsOpen ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[22px] border border-white/10 bg-black/24 p-4">
              <p className="eyebrow">{copy.promptCategory}</p>
              <p className="mt-3 text-sm leading-5 text-ink/76">{promptCategory}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-black/24 p-4">
              <p className="eyebrow">{copy.emotionalTone}</p>
              <p className="mt-3 text-sm leading-5 text-ink/76">{emotionalTone}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-white/10 bg-white/6 p-4">
            <p className="eyebrow">{copy.structure}</p>
            <ul className="mt-4 space-y-3 text-sm leading-5 text-ink/74">
              {structure.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
              <p className="eyebrow">{copy.aiSummary}</p>
              <p className="mt-3 text-sm leading-5 text-ink/76">{aiSummary}</p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
              <p className="eyebrow">{copy.reconnect}</p>
              <p className="mt-3 text-sm leading-5 text-ink/76">{reconnect}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="eyebrow">{copy.prompts}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <span
                  key={prompt}
                  className="rounded-full border border-white/10 bg-black/24 px-3 py-2 text-sm text-ink/78"
                >
                  {prompt}
                </span>
              ))}
            </div>
          </div>

          {item.mode ? (
            <div className="mt-6 flex items-center justify-end">
              <Link
                href={`/matchmaking?mode=${item.mode}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-fog transition hover:bg-[#f3ecff]"
              >
                {copy.cta}
              </Link>
            </div>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
