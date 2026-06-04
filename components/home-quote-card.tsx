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
    <div className="glass-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{t.home.quoteEyebrow}</p>
        <span className="rounded-full border border-border-soft bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
          {getModeName(quote.mode, locale)}
        </span>
      </div>
      <blockquote className="mt-4 font-display text-[1.8rem] italic leading-[1.05] tracking-[-0.02em] text-foreground">
        "{quote.quote}"
      </blockquote>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{t.home.quoteBody}</p>
    </div>
  );
}
