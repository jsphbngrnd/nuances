import { AppShell } from "@/components/app-shell";
import { LiveRoom } from "@/components/live-room";
import { getCurrentIdentity } from "@/lib/server-identity";
import { getLocale } from "@/lib/server-locale";

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const locale = await getLocale();
  const identity = await getCurrentIdentity();
  return (
    <AppShell locale={locale} showNav={false}>
      <LiveRoom roomId={id} locale={locale} topicId={query.topic} currentUserAlias={identity.alias} />
    </AppShell>
  );
}
