"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StatusBar, Screen, Field, ArrowIcon, inputStyle } from "@/components/ui";

function AuthPageInner() {
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
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
      if (error) setError(error.message);
      else router.push("/auth/confirming");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else { router.push("/home"); router.refresh(); }
    }
    setLoading(false);
  }

  return (
    <div className="nuance-phone">
      <div className="np-notch" />
      <StatusBar />
      <Screen>
        <div style={{ paddingTop: 26, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>☾</div>
          <h1 className="np-display" style={{ fontSize: 30, marginTop: 16 }}>
            {isSignup ? "Create your alias." : "Welcome back."}
          </h1>
          <p style={{ margin: "12px auto 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)", maxWidth: "30ch" }}>
            {isSignup ? "An email and password is all we keep. No name, no photo, no profile." : "Sign in to pick up where the conversation left off."}
          </p>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 26, padding: 4, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
          {([["signup", "Create account"], ["signin", "Sign in"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setError(""); }} style={{ padding: "10px 0", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", background: tab === id ? "var(--accent)" : "transparent", color: tab === id ? "var(--on-accent)" : "var(--text)", transition: "background 160ms ease" }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gap: 14, marginTop: 24 }}>
          <Field label="Email">
            <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Password">
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          </Field>
          {isSignup && <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: "var(--faint)" }}>By continuing you agree to talk like a person. Moderation and reporting are always on.</p>}
          {error && <p style={{ margin: 0, fontSize: 11, color: "var(--danger)" }}>{error}</p>}
        </div>

        <button className="np-btn" style={{ width: "100%", marginTop: 22 }} disabled={loading} onClick={handleSubmit}>
          {loading ? "Just a moment…" : isSignup ? "Send confirmation email" : "Sign in"} {!loading && <ArrowIcon />}
        </button>
        <p style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-caps)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)" }}>
          Email · no name · no photo · no credit card
        </p>
      </Screen>
    </div>
  );
}

import { Suspense } from "react";
export default function AuthPage() { return <Suspense fallback={<div className="nuance-phone" />}><AuthPageInner /></Suspense>; }
