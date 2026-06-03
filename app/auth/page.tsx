import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { getCopy } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function AuthPage() {
  const locale = await getLocale();
  const t = getCopy(locale);

  return (
    <AppShell locale={locale} showNav={false}>
      <section className="screen-card">
        <h1 className="screen-heading mt-4">{t.auth.title}</h1>
        <p className="eyebrow mt-3">{t.auth.eyebrow}</p>
        <p className="mt-4 max-w-[30ch] text-sm leading-6 text-ink/78">
          {t.auth.body}
        </p>

        <div className="mt-8 space-y-3">
          <button className="w-full rounded-full bg-bone px-5 py-4 text-sm font-semibold text-fog">
            {t.auth.email}
          </button>
          <button className="w-full rounded-full border border-white/15 bg-white/[0.12] px-5 py-4 text-sm font-medium text-white transition hover:border-bone hover:bg-bone hover:text-fog">
            {t.auth.apple}
          </button>
        </div>

        <div className="my-6 hairline" />

        <div className="space-y-4 text-sm leading-6 text-stone">
          {t.auth.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/" className="soft-link">
            {t.auth.back}
          </Link>
          <Link href="/onboarding" className="soft-link">
            {t.auth.continue}
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
