import Link from "next/link";
import { MODE_CONFIG } from "@/lib/modes";
import type { ConversationMode } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { getModeCopy, getModeName } from "@/lib/i18n";

export function ModeCard({ mode, locale }: { mode: ConversationMode; locale: Locale }) {
  const config = MODE_CONFIG[mode];
  const modeCopy = getModeCopy(mode, locale);

  return (
    <article
      className={`glass-panel relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 ${config.colorClass} bg-gradient-to-br`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_34%)] opacity-70" />
      <div className="relative space-y-5 text-left">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="eyebrow">{modeCopy.shortLabel}</p>
              <h3
                className={`mt-3 font-display text-[1.85rem] leading-none tracking-[-0.04em] text-white ${
                  mode === "late-night" ? "whitespace-nowrap text-[1.72rem]" : ""
                }`}
              >
                <span className="mr-2">{config.emoji}</span>
                {getModeName(mode, locale)}
              </h3>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-black/28 px-3 py-1 text-[0.6rem] uppercase tracking-[0.24em] text-white/58">
              {config.cadence}
            </span>
          </div>
          <p className="mt-3 max-w-[36ch] text-sm leading-6 text-white/46">
            {modeCopy.tagline}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4 text-left">
          <p className="max-w-[30ch] text-[0.82rem] leading-[1.18rem] text-white/16">
            {modeCopy.description}
          </p>
          <Link
            href={`/matchmaking?mode=${mode}`}
            className="shrink-0 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-fog"
          >
            {locale === "fr" ? "Rejoindre" : "Join"}
          </Link>
        </div>
      </div>
    </article>
  );
}
