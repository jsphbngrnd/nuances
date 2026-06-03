import { AppShell } from "@/components/app-shell";
import { SummaryClient } from "@/components/summary-client";
import { getCopy } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getCopy(locale);

  return (
    <AppShell locale={locale} showNav={false}>
      <SummaryClient
        roomId={id}
        locale={locale}
        labels={{
          eyebrow: t.summary.eyebrow,
          title: t.summary.title,
          sharedThemes: t.summary.sharedThemes,
          semanticTags: t.summary.semanticTags,
          agreementPoints: t.summary.agreementPoints,
          disagreementPoints: t.summary.disagreementPoints,
          emotionalTone: t.summary.emotionalTone,
          reconnect: t.summary.reconnect,
          talkAgain: t.summary.talkAgain,
          nextPerson: t.summary.nextPerson,
          reflection: t.summary.reflection,
          reflectionQuestion: t.summary.reflectionQuestion,
          reflectionOptions: t.summary.reflectionOptions,
          goFurther: t.summary.goFurther,
          goFurtherBody: t.summary.goFurtherBody,
          saveItem: t.summary.saveItem,
          savedItem: t.summary.savedItem,
          openItem: t.summary.openItem,
          sponsored: t.summary.sponsored,
        }}
      />
    </AppShell>
  );
}
