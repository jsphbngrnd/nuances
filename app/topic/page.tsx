import { AppShell } from "@/components/app-shell";
import { TopicAcceptanceClient } from "@/components/topic-acceptance-client";
import { MODE_CONFIG } from "@/lib/modes";
import { getDemoRoomIdForMode, getTopicsForMode } from "@/lib/mock-data";
import { getCopy } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function TopicAcceptancePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const t = getCopy(locale);
  const modeKey =
    params.mode === "debate" || params.mode === "funny" || params.mode === "deep" || params.mode === "late-night"
      ? params.mode
      : "late-night";
  const topics = getTopicsForMode(modeKey);
  const mode = MODE_CONFIG[modeKey];
  const roomId = getDemoRoomIdForMode(modeKey);

  return (
    <AppShell locale={locale} showNav={false}>
      <TopicAcceptanceClient
        locale={locale}
        mode={mode}
        modeKey={modeKey}
        roomId={roomId}
        topics={topics}
        labels={{
          eyebrow: t.topic.eyebrow,
          title: t.topic.title,
          body: t.topic.body,
          accept: t.topic.accept,
          reroll: t.topic.reroll,
        }}
      />
    </AppShell>
  );
}
