import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";
import { getCopy } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";

export default async function AuthPage() {
  const locale = await getLocale();
  const t = getCopy(locale);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <AppShell locale={locale} showNav={false}>
      <section className="screen-card">
        <h1 className="screen-heading mt-4">{t.auth.title}</h1>
        <p className="eyebrow mt-3">{t.auth.eyebrow}</p>
        <p className="mt-4 max-w-[30ch] text-sm leading-6 text-ink/78">
          {t.auth.body}
        </p>

        <div className="mt-8">
          <AuthForm appUrl={appUrl} />
        </div>

        <div className="my-6 hairline" />

        <div className="space-y-4 text-sm leading-6 text-stone">
          {t.auth.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>

        <div className="mt-6">
          <Link href="/" className="soft-link text-sm">
            {t.auth.back}
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
