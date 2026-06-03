import { AppShell } from "@/components/app-shell";
import { OnboardingIdentityClient } from "@/components/onboarding-identity-client";
import { getCopy } from "@/lib/i18n";
import { getCurrentIdentity } from "@/lib/server-identity";
import { getLocale } from "@/lib/server-locale";

export default async function OnboardingPage() {
  const locale = await getLocale();
  const t = getCopy(locale);
  const identity = await getCurrentIdentity();

  return (
    <AppShell
      locale={locale}
      showNav={false}
      header={
        <header className="screen-header">
          <h1 className="screen-heading mt-4">{t.onboarding.title}</h1>
          <p className="eyebrow mt-3">{t.onboarding.eyebrow}</p>
          <p className="mt-4 max-w-[32ch] text-sm leading-6 text-ink/78">
            {t.onboarding.body}
          </p>
        </header>
      }
    >
      <OnboardingIdentityClient locale={locale} initialIdentity={identity} copy={t.onboarding} />
    </AppShell>
  );
}
