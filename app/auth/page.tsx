"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StatusBar, Screen, Field, ArrowIcon, inputStyle } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";

function AuthPageInner() {
  const t = useCopy();
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<"signup" | "signin">(params.get("tab") === "signin" ? "signin" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSignup = tab === "signup";

  async function handleSubmit() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
      if (error) setError(error.message);
      else if (data.session) {
        // Email confirmation disabled — already signed in, go straight to onboarding
        router.push("/onboarding");
        router.refresh();
      } else {
        // Email confirmation enabled — show the check-your-email screen
        router.push("/auth/confirming");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else { router.push("/home"); router.refresh(); }
    }
    setLoading(false);
  }

  return (
    <div className="nuance-phone">


      <Screen>
        <div style={{ paddingTop: 26, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>☾</div>
          <h1 className="np-display" style={{ fontSize: 30, marginTop: 16 }}>
            {isSignup ? t.auth.signup.title : t.auth.signin.title}
          </h1>
          <p style={{ margin: "12px auto 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)", maxWidth: "30ch" }}>
            {isSignup ? t.auth.signup.sub : t.auth.signin.sub}
          </p>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 26, padding: 4, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
          {([["signup", t.auth.tabSignup], ["signin", t.auth.tabSignin]] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setError(""); }} style={{ padding: "10px 0", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", background: tab === id ? "var(--accent)" : "transparent", color: tab === id ? "var(--on-accent)" : "var(--text)", transition: "background 160ms ease" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
          <Field label={t.auth.emailLabel}>
            <input type="email" placeholder={t.auth.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </Field>
          <Field label={t.auth.passwordLabel}>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          </Field>
          {isSignup && <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: "var(--faint)" }}>{t.auth.consent}</p>}
          {error && <p style={{ margin: 0, fontSize: 11, color: "var(--danger)" }}>{error}</p>}
        </div>

        <button className="np-btn" style={{ width: "100%", marginTop: 22 }} disabled={loading} onClick={handleSubmit}>
          {loading ? "Just a moment…" : isSignup ? t.auth.submitSignup : t.auth.submitSignin} {!loading && <ArrowIcon />}
        </button>
        <p style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-caps)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)" }}>
          {t.auth.trust}
        </p>
      </Screen>
    </div>
  );
}

import { Suspense } from "react";
export default function AuthPage() { return <Suspense fallback={<div className="nuance-phone" />}><AuthPageInner /></Suspense>; }
