import { AppShell } from "@/components/app-shell";
import { getCopy } from "@/lib/i18n";
import { getCurrentIdentity } from "@/lib/server-identity";
import { getLocale } from "@/lib/server-locale";

export default async function SettingsPage() {
  const locale = await getLocale();
  const identity = await getCurrentIdentity();
  const t = getCopy(locale);

  return (
    <AppShell
      locale={locale}
      currentNav="/settings"
      header={
        <header className="screen-header">
          <h1 className="screen-heading mt-4">{t.settings.title}</h1>
          <p className="eyebrow mt-3">{t.settings.eyebrow}</p>
          <p className="mt-4 max-w-[32ch] text-sm leading-6 text-ink/78">
            {t.settings.body}
          </p>
        </header>
      }
    >
      <section className="screen-stack">
        <article className="screen-card">
          <p className="eyebrow">
            {locale === "fr" ? "Identité" : "Identity"}
          </p>
          <h2 className="mt-3 app-section-title">{identity.alias}</h2>
          <p className="mt-3 max-w-[32ch] text-sm leading-6 text-ink/74">
            {locale === "fr"
              ? `Votre identité anonyme actuelle est au stade ${identity.aliasStage}. Elle pourra évoluer plus tard sans jamais exposer votre vrai nom.`
              : `Your anonymous identity is currently at stage ${identity.aliasStage}. It can evolve later without ever exposing your real name.`}
          </p>
        </article>

        {t.settings.controls.map((control) => (
          <article key={control.label} className="screen-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg text-ink">{control.label}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/74">{control.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="mt-1 h-5 w-5 accent-bone" />
            </div>
          </article>
        ))}

        <article className="screen-card">
          <p className="eyebrow">{t.settings.conductEyebrow}</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/76">
            {t.settings.conduct.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
