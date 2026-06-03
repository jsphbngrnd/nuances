import { getCopy, getModeName, type Locale } from "@/lib/i18n";
import type { ConversationQuoteOfDay } from "@/lib/mock-data";

export function HomeQuoteCard({
  locale,
  quote,
}: {
  locale: Locale;
  quote: ConversationQuoteOfDay;
}) {
  const t = getCopy(locale);

  return (
    <article className="screen-card overflow-hidden">
      <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mt-3">{t.home.quoteEyebrow}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-black/24 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/72">
            {getModeName(quote.mode, locale)}
          </span>
        </div>

        <blockquote className="mt-4 max-w-[12ch] font-display text-[2.15rem] leading-[0.88] tracking-[-0.04em] text-white">
          “{quote.quote}”
        </blockquote>

        <p className="mt-4 max-w-[34ch] text-[0.76rem] leading-[1.05rem] text-white/46">
          {t.home.quoteBody}
        </p>

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-xs uppercase tracking-[0.22em] text-white/42">{quote.topic}</p>
          <p className="mt-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/34">
            {quote.sourceLabel}
          </p>
        </div>
      </div>
    </article>
  );
}
