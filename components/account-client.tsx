"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/lib/i18n";

type Profile = {
  display_name: string;
  alias: string;
  age_range: string;
  language: string;
  country: string;
  mood_default: string | null;
  voice_enabled: boolean;
  reconnect_enabled: boolean;
  profiles_optional: { interests_json: string[] } | null;
};

const MOODS = { en: ["Calm", "Curious", "Restless", "Reflective", "Open"], fr: ["Calme", "Curieux", "Agité", "Réfléchi", "Ouvert"] };
const AGE_RANGES = ["18-21", "22-24", "25-29", "30-34", "35-44", "45+"];

export function AccountClient({ profile, locale }: { profile: Profile | null; locale: Locale }) {
  const router = useRouter();
  const isEn = locale !== "fr";

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [ageRange, setAgeRange] = useState(profile?.age_range ?? "25-29");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [mood, setMood] = useState(profile?.mood_default ?? "");
  const [interests, setInterests] = useState(
    profile?.profiles_optional?.interests_json?.join(", ") ?? ""
  );
  const [voiceEnabled, setVoiceEnabled] = useState(profile?.voice_enabled ?? true);
  const [reconnectEnabled, setReconnectEnabled] = useState(profile?.reconnect_enabled ?? true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, ageRange, country, mood, interests, voiceEnabled, reconnectEnabled }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const res = await fetch("/api/user", { method: "DELETE" });
    if (res.ok) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } else {
      setDeleting(false);
      setError(isEn ? "Could not delete account. Contact support." : "Impossible de supprimer. Contactez le support.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder-white/32 outline-none transition focus:border-white/28 focus:bg-white/[0.08]";
  const selectClass =
    "w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-foreground outline-none transition focus:border-white/28 focus:bg-white/[0.08]";

  return (
    <div className="space-y-6">
      {/* Alias header */}
      {profile && (
        <div className="rounded-2xl border border-white/08 bg-white/[0.04] px-5 py-4">
          <p className="eyebrow">{isEn ? "Your alias" : "Votre alias"}</p>
          <p className="mt-2 font-display text-2xl leading-none tracking-tight text-foreground">
            {profile.alias}
          </p>
        </div>
      )}

      {/* Profile fields */}
      <div className="space-y-3">
        <p className="eyebrow">{isEn ? "Profile" : "Profil"}</p>
        <input
          type="text"
          placeholder={isEn ? "Display name or nickname" : "Prénom ou pseudo"}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={selectClass}>
            {AGE_RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={mood} onChange={(e) => setMood(e.target.value)} className={selectClass}>
            {MOODS[locale === "fr" ? "fr" : "en"].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <input
          type="text"
          placeholder={isEn ? "Country or region" : "Pays ou région"}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder={isEn ? "Interests (comma-separated)" : "Centres d'intérêt (séparés par des virgules)"}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Preferences toggles */}
      <div className="rounded-2xl border border-white/08 bg-white/[0.04] p-4 space-y-4">
        <p className="eyebrow">{isEn ? "Preferences" : "Préférences"}</p>
        {[
          { label: isEn ? "🎙️ Voice input" : "🎙️ Voix", value: voiceEnabled, set: setVoiceEnabled },
          { label: isEn ? "💌 Reconnect requests" : "💌 Demandes de recontact", value: reconnectEnabled, set: setReconnectEnabled },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-xs text-foreground">{label}</span>
            <button
              type="button"
              onClick={() => set((v) => !v)}
              className={`relative h-6 w-10 rounded-full border transition-colors ${value ? "border-primary bg-primary" : "border-white/20 bg-white/[0.06]"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </label>
        ))}
      </div>

      {error && <p className="text-xs text-red-400/90">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground disabled:opacity-40 transition"
      >
        {saving ? (isEn ? "Saving…" : "Sauvegarde…") : saved ? (isEn ? "✓ Saved" : "✓ Sauvegardé") : (isEn ? "Save changes" : "Enregistrer")}
      </button>

      {/* Divider */}
      <div className="hairline" />

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        disabled={signingOut}
        className="w-full rounded-full border border-white/12 bg-transparent px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-white/[0.06] disabled:opacity-40"
      >
        {signingOut ? (isEn ? "Signing out…" : "Déconnexion…") : (isEn ? "Sign out" : "Se déconnecter")}
      </button>

      {/* Delete account */}
      <div className="space-y-2">
        {confirmDelete && (
          <p className="text-center text-xs text-red-400/90">
            {isEn ? "This is permanent and cannot be undone." : "Cette action est permanente et irréversible."}
          </p>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full rounded-full border border-red-500/30 bg-transparent px-5 py-3.5 text-sm font-semibold text-red-400/80 transition hover:border-red-500/60 hover:text-red-400 disabled:opacity-40"
        >
          {deleting
            ? (isEn ? "Deleting…" : "Suppression…")
            : confirmDelete
            ? (isEn ? "Yes, delete my account" : "Oui, supprimer mon compte")
            : (isEn ? "Delete account" : "Supprimer le compte")}
        </button>
        {confirmDelete && (
          <button
            onClick={() => setConfirmDelete(false)}
            className="w-full text-center text-xs soft-link"
          >
            {isEn ? "Cancel" : "Annuler"}
          </button>
        )}
      </div>
    </div>
  );
}
