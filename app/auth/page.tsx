import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { AuthForm } from "@/components/auth-form";
import { getLocale } from "@/lib/server-locale";

export default async function AuthPage() {
  const locale = await getLocale();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <AppShell locale={locale} showNav={false}>
      <section className="screen-card">
        <AuthForm appUrl={appUrl} />

        <div className="my-8 hairline" />

        <div className="space-y-3 text-xs leading-5 text-white/42">
          <p>No public profile is created at signup. Your identity stays private.</p>
          <p>After signing up, check your email to confirm your account.</p>
        </div>

        <div className="mt-6">
          <Link href="/" className="soft-link text-sm">
            Back
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
