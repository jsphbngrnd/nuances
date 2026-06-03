"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm({ appUrl }: { appUrl: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${appUrl}/auth/callback?next=/onboarding`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setConfirmed(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/home");
        router.refresh();
      }
    }

    setLoading(false);
  }

  if (confirmed) {
    return (
      <div className="space-y-6 pt-2">
        <div>
          <p className="eyebrow">Check your inbox</p>
          <h2 className="screen-heading mt-3">One step left.</h2>
          <p className="mt-4 text-sm leading-6 text-ink/78">
            We sent a confirmation link to{" "}
            <span className="text-white/90">{email}</span>. Click it to
            activate your account and get started.
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setConfirmed(false); setMode("signin"); }}
          className="soft-link text-sm"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3.5 text-sm text-white/90 placeholder-white/32 outline-none transition focus:border-white/28 focus:bg-white/[0.08]";

  return (
    <div className="space-y-6 pt-2">
      <div>
        <p className="eyebrow">
          {mode === "signin" ? "Welcome back" : "Get started"}
        </p>
        <h2 className="screen-heading mt-3">
          {mode === "signin" ? "Sign in." : "Create your account."}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputClass}
        />
        <input
          type="password"
          placeholder={mode === "signup" ? "Choose a password" : "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className={inputClass}
        />

        {error && (
          <p className="pt-1 text-xs leading-5 text-red-400/90">{error}</p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-bone px-5 py-4 text-sm font-semibold text-fog transition disabled:opacity-40"
          >
            {loading
              ? "Just a moment…"
              : mode === "signup"
              ? "Create account"
              : "Sign in"}
          </button>
        </div>
      </form>

      <p className="text-center text-xs text-white/46">
        {mode === "signin" ? (
          <>
            No account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="soft-link"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="soft-link"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
