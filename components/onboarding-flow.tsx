"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateAlias } from "@/lib/alias";
import type { Locale } from "@/lib/i18n";

type Step = "language" | "intro" | "conduct" | "alias" | "profile";

const STEPS: Step[] = ["language", "intro", "conduct", "alias", "profile"];

const CONDUCT_RULES = {
  en: [
    "No harassment, hate speech, threats, doxxing, or sexual misconduct. Violations trigger immediate blocking and may end the room.",
    "Never share personal identifying information — yours or anyone else's. Names, addresses, phone numbers, social handles.",
    "Blocked content is never invisible. You will always see a clear explanation of what was flagged and why.",
    "All conversations are moderated in near real-time. The system is not invisible — it is present.",
    "You can report or block anyone at any point during a room. No explanation needed.",
    "Repeat violations reduce your trust score. A low trust score removes your access to the matchmaking queue.",
    "This is a space for genuine exchange — not performance, not trolling, not collecting reactions.",
    "Respect the structure. Each mode has a rhythm. Working with it makes the conversation better for both people.",
  ],
  fr: [
    "Aucun harcèlement, discours haineux, menaces, doxxing ou comportement sexuel déplacé. Les violations entraînent un blocage immédiat.",
    "Ne partagez jamais d'informations personnelles identifiables — les vôtres ou celles de quelqu'un d'autre.",
    "Le contenu bloqué n'est jamais invisible. Vous verrez toujours une explication claire de ce qui a été signalé.",
    "Toutes les conversations sont modérées en quasi temps réel. Le système est présent.",
    "Vous pouvez signaler ou bloquer n'importe qui à tout moment pendant un salon.",
    "Les violations répétées réduisent votre score de confiance et peuvent retirer votre accès à la file.",
    "Ceci est un espace d'échange authentique — pas de performance, pas de trolling.",
    "Respectez la structure. Chaque mode a un rythme. Le suivre rend la conversation meilleure pour les deux personnes.",
  ],
};

const INTRO_POINTS = {
  en: [
    { emoji: "👥", title: "Two strangers.", body: "NUANCE matches you with one other person. No group chats, no feeds, no audience." },
    { emoji: "💬", title: "One topic.", body: "You both get the same topic. Accept it or reroll — up to two times. Then you talk." },
    { emoji: "🛡️", title: "Full structure.", body: "Each mode has a timer, a rhythm, and a moderation layer. The room is safe by design." },
    { emoji: "🌙", title: "No profiles.", body: "You get an alias. Not a username — an alias. It evolves as you keep talking." },
  ],
  fr: [
    { emoji: "👥", title: "Deux inconnus.", body: "NUANCE vous met en relation avec une seule autre personne. Pas de groupe, pas de fil d'actualité." },
    { emoji: "💬", title: "Un sujet.", body: "Vous recevez le même sujet. Acceptez-le ou rerollez — jusqu'à deux fois. Puis vous parlez." },
    { emoji: "🛡️", title: "Structure complète.", body: "Chaque mode a un timer, un rythme et une couche de modération. Le salon est sécurisé par design." },
    { emoji: "🌙", title: "Pas de profils.", body: "Vous recevez un alias. Pas un pseudo — un alias. Il évolue à mesure que vous conversez." },
  ],
};

const AGE_RANGES = ["18-21", "22-24", "25-29", "30-34", "35-44", "45+"];
const MOODS = { en: ["Calm", "Curious", "Restless", "Reflective", "Open"], fr: ["Calme", "Curieux", "Agité", "Réfléchi", "Ouvert"] };

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("language");
  const [locale, setLocale] = useState<Locale>("en");
  const [conductRead, setConductRead] = useState(false);
  const [conductAccepted, setConductAccepted] = useState(false);
  const conductRef = useRef<HTMLDivElement>(null);
  const [alias, setAlias] = useState(() => generateAlias({ stage: 1 }));
  const [rerollsLeft, setRerollsLeft] = useState(2);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile fields
  const [displayName, setDisplayName] = useState("");
  const [ageRange, setAgeRange] = useState("25-29");
  const [country, setCountry] = useState("");
  const [mood, setMood] = useState(MOODS.en[1]);
  const [interests, setInterests] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [reconnectEnabled, setReconnectEnabled] = useState(true);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function next() {
    const nextStep = STEPS[stepIndex + 1];
    if (nextStep) setStep(nextStep);
  }

  function handleLocale(l: Locale) {
    setLocale(l);
    setMood(MOODS[l][1]);
    next();
  }

  function handleConductScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) {
      setConductRead(true);
    }
  }

  function handleReroll() {
    if (rerollsLeft <= 0) return;
    setAlias(generateAlias({ excludeFamilyId: alias.familyId, stage: 1 }));
    setRerollsLeft((n) => n - 1);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName || alias.alias,
          alias: alias.alias,
          aliasFamily: alias.familyId,
          aliasStage: alias.stage,
          ageRange,
          language: locale,
          country: country || (locale === "fr" ? "France" : "Unknown"),
          mood,
          interests,
          voiceEnabled,
          reconnectEnabled,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push("/home");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder-white/32 outline-none transition focus:border-white/28 focus:bg-white/[0.08]";

  const selectClass =
    "w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm text-foreground outline-none transition focus:border-white/28 focus:bg-white/[0.08]";

  // ── Step: Language ──────────────────────────────────────────
  if (step === "language") {
    return (
      <div className="space-y-8 pt-2">
        <div>
          <p className="eyebrow">Welcome</p>
          <h1 className="screen-heading mt-3">Choose your language.</h1>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => handleLocale("en")}
            className="w-full rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-5 text-left transition hover:bg-white/[0.09]"
          >
            <p className="text-base font-semibold text-foreground">English</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Continue in English</p>
          </button>
          <button
            onClick={() => handleLocale("fr")}
            className="w-full rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-5 text-left transition hover:bg-white/[0.09]"
          >
            <p className="text-base font-semibold text-foreground">Français</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Continuer en français</p>
          </button>
        </div>
      </div>
    );
  }

  // ── Step: Intro ─────────────────────────────────────────────
  if (step === "intro") {
    const points = INTRO_POINTS[locale];
    return (
      <div className="space-y-6 pt-2">
        <div>
          <p className="eyebrow">{locale === "fr" ? "Bienvenue" : "What is this"}</p>
          <h1 className="screen-heading mt-3">
            {locale === "fr" ? "NUANCE en quatre points." : "NUANCE in four points."}
          </h1>
        </div>

        <div className="space-y-3">
          {points.map((point) => (
            <div key={point.title} className="flex gap-4 rounded-2xl border border-white/08 bg-white/[0.04] p-4">
              <span className="text-xl">{point.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{point.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{point.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={next}
          className="w-full rounded-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground"
        >
          {locale === "fr" ? "Continuer" : "Continue"}
        </button>
      </div>
    );
  }

  // ── Step: Conduct ───────────────────────────────────────────
  if (step === "conduct") {
    const rules = CONDUCT_RULES[locale];
    return (
      <div className="space-y-5 pt-2">
        <div>
          <p className="eyebrow">{locale === "fr" ? "Règles de conduite" : "Conduct"}</p>
          <h1 className="screen-heading mt-3">
            {locale === "fr" ? "Lisez avant de continuer." : "Read before you continue."}
          </h1>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {locale === "fr"
              ? "Faites défiler jusqu'au bas pour accepter."
              : "Scroll to the bottom to accept."}
          </p>
        </div>

        <div
          ref={conductRef}
          onScroll={handleConductScroll}
          className="max-h-56 overflow-y-auto rounded-2xl border border-white/08 bg-white/[0.04] p-4 space-y-4"
        >
          {rules.map((rule, i) => (
            <div key={i} className="flex gap-3">
              <span className="eyebrow mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-xs leading-5 text-muted-foreground">{rule}</p>
            </div>
          ))}
          <div className="h-2" />
        </div>

        <label className={`flex items-start gap-3 rounded-2xl border px-4 py-4 transition cursor-pointer ${conductRead ? "border-white/20 bg-white/[0.06]" : "border-white/08 bg-white/[0.02] opacity-50 pointer-events-none"}`}>
          <div
            className={`mt-0.5 h-4 w-4 shrink-0 rounded border transition ${conductAccepted ? "border-primary bg-primary" : "border-white/30 bg-transparent"}`}
            onClick={() => conductRead && setConductAccepted((v) => !v)}
          />
          <p className="text-xs leading-5 text-foreground">
            {locale === "fr"
              ? "Je comprends et j'accepte les règles de conduite."
              : "I understand and accept the conduct rules."}
          </p>
        </label>

        <button
          onClick={next}
          disabled={!conductAccepted}
          className="w-full rounded-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground disabled:opacity-30 transition"
        >
          {locale === "fr" ? "J'accepte" : "I accept"}
        </button>
      </div>
    );
  }

  // ── Step: Alias ─────────────────────────────────────────────
  if (step === "alias") {
    return (
      <div className="space-y-6 pt-2">
        <div>
          <p className="eyebrow">{locale === "fr" ? "Identité" : "Identity"}</p>
          <h1 className="screen-heading mt-3">
            {locale === "fr" ? "Votre alias." : "Your alias."}
          </h1>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {locale === "fr"
              ? "NUANCE ne veut pas votre vrai nom. Il vous donne un alias vivant — mémorable et anonyme."
              : "NUANCE doesn't want your real name. It gives you a living alias — memorable and still anonymous."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-5">
          <p className="eyebrow">{locale === "fr" ? "Votre identité" : "Your identity"}</p>
          <p className="mt-4 font-display text-display-1 leading-none tracking-tight text-foreground">
            {alias.alias}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {locale === "fr"
              ? "Cet alias évoluera au fil de vos conversations."
              : "This alias will evolve as you keep talking."}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleReroll}
              disabled={rerollsLeft <= 0}
              className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-white/[0.09] disabled:opacity-30"
            >
              {locale === "fr" ? "Changer" : "Reroll"}
            </button>
            <span className="eyebrow">{rerollsLeft} {locale === "fr" ? "restant" : "left"}</span>
          </div>
        </div>

        <button
          onClick={next}
          className="w-full rounded-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground"
        >
          {locale === "fr" ? "Cet alias me convient" : "This alias works"}
        </button>
      </div>
    );
  }

  // ── Step: Profile ───────────────────────────────────────────
  return (
    <div className="space-y-5 pt-2">
      <div>
        <p className="eyebrow">{locale === "fr" ? "Profil" : "Profile"}</p>
        <h1 className="screen-heading mt-3">
          {locale === "fr" ? "Quelques détails." : "A few details."}
        </h1>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {locale === "fr"
            ? "Ces infos nous aident à mieux vous matcher. Elles ne sont jamais publiques."
            : "This helps us match you better. It's never public."}
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder={locale === "fr" ? "Prénom ou pseudo (optionnel)" : "First name or nickname (optional)"}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={selectClass}>
            {AGE_RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select value={mood} onChange={(e) => setMood(e.target.value)} className={selectClass}>
            {MOODS[locale].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <input
          type="text"
          placeholder={locale === "fr" ? "Pays ou région" : "Country or region"}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder={locale === "fr" ? "Centres d'intérêt (optionnel, séparés par des virgules)" : "Interests (optional, comma-separated)"}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="rounded-2xl border border-white/08 bg-white/[0.04] p-4 space-y-4">
        <p className="eyebrow">{locale === "fr" ? "Préférences" : "Preferences"}</p>
        {[
          {
            label: locale === "fr" ? "🎙️ Activer la voix" : "🎙️ Enable voice",
            value: voiceEnabled,
            set: setVoiceEnabled,
          },
          {
            label: locale === "fr" ? "💌 Autoriser les recontacts" : "💌 Allow reconnect requests",
            value: reconnectEnabled,
            set: setReconnectEnabled,
          },
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
        {saving
          ? locale === "fr" ? "Sauvegarde…" : "Saving…"
          : locale === "fr" ? "✨ Commencer" : "✨ Let's go"}
      </button>
    </div>
  );
}
