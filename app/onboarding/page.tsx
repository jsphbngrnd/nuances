import { AppShell } from "@/components/app-shell";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { getLocale } from "@/lib/server-locale";

export default async function OnboardingPage() {
  const locale = await getLocale();

  return (
    <AppShell locale={locale} showNav={false}>
      <section className="screen-card">
        <OnboardingFlow />
      </section>
    </AppShell>
  );
}
