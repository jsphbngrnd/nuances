import { AppShell } from "@/components/app-shell";
import { AutonomousDemo } from "@/components/autonomous-demo";
import { getLocale } from "@/lib/server-locale";

export default async function DemoPage() {
  const locale = await getLocale();

  return (
    <AppShell locale={locale} currentNav="/home">
      <AutonomousDemo locale={locale} />
    </AppShell>
  );
}
