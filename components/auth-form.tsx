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
  const [message, setMessage] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

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
        setMessage("Check your email to confirm your account.");
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

  const inputClass =
    "w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/[0.09]";

  return (
    <div className="space-y-5">
      <div className="flex rounded-full border border-white/12 bg-white/[0.05] p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`flex-1 rounded-full py-2.5 text-xs font-semibold tracking-wide transition ${
            mode === "signin"
              ? "bg-bone text-fog shadow-sm"
              : "text-white/60 hover:text-white/90"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 rounded-full py-2.5 text-xs font-semibold tracking-wide transition ${
            mode === "signup"
              ? "bg-bone text-fog shadow-sm"
              : "text-white/60 hover:text-white/90"
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className={inputClass}
        />

        {error && (
          <p className="text-xs text-red-400/90">{error}</p>
        )}
        {message && (
          <p className="text-xs text-emerald-400/90">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-bone px-5 py-4 text-sm font-semibold text-fog transition disabled:opacity-50"
        >
          {loading
            ? "..."
            : mode === "signup"
            ? "✨ Create account"
            : "✉️ Sign in"}
        </button>
      </form>
    </div>
  );
}
