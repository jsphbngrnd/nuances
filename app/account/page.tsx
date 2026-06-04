import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AccountClient } from "@/components/account-client";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/server-locale";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const locale = await getLocale();

  const { data: profile } = await supabase
    .from("users")
    .select("*, profiles_optional(*)")
    .eq("id", user.id)
    .single();

  const isEn = locale !== "fr";

  return (
    <AppShell locale={locale} currentNav="/account" showNav>
      <div className="screen-stack">
        <div className="screen-header">
          <p className="eyebrow">{isEn ? "Account" : "Compte"}</p>
          <h1 className="screen-heading mt-3">
            {isEn ? "Your profile." : "Votre profil."}
          </h1>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {isEn
              ? "This information is never public. It only shapes how you're matched."
              : "Ces informations ne sont jamais publiques. Elles guident uniquement votre matching."}
          </p>
        </div>

        <div className="screen-card">
          <AccountClient profile={profile} locale={locale} />
        </div>
      </div>
    </AppShell>
  );
}
