"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { generateAlias } from "@/lib/alias";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  initialIdentity: {
    alias: string;
    aliasFamily: string;
    aliasStage: number;
  };
  copy: {
    ageRange: string;
    language: string;
    country: string;
    mood: string;
    interests: string;
    toggles: string[];
    back: string;
    continue: string;
    moods: string[];
  };
};

export function OnboardingIdentityClient({ locale, initialIdentity, copy }: Props) {
  const router = useRouter();
  const [identity, setIdentity] = useState(initialIdentity);
  const [rerollsLeft, setRerollsLeft] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  const identityCopy = useMemo(
    () =>
      locale === "fr"
        ? {
            eyebrow: "Identité anonyme",
            title: "NUANCE n'a pas besoin de votre vrai nom.",
            body:
              "À la place, l'app vous donne un pseudo vivant, un peu étrange, et suffisamment mémorable pour traverser les conversations sans casser l'anonymat.",
            reveal: "Votre identité actuelle",
            reroll: "Changer de pseudo",
            rerollsLeft: `${rerollsLeft} renouvellement${rerollsLeft > 1 ? "s" : ""} restant${rerollsLeft > 1 ? "s" : ""}`,
            evolves: "Ce pseudo pourra évoluer plus tard, au fil des conversations.",
          }
        : {
            eyebrow: "Stranger identity",
            title: "NUANCE does not need your real name.",
            body:
              "Instead, the app gives you a living alias: slightly strange, memorable enough to carry through conversations, and still anonymous.",
            reveal: "Your current identity",
            reroll: "Refresh alias",
            rerollsLeft: `${rerollsLeft} reroll${rerollsLeft > 1 ? "s" : ""} left`,
            evolves: "This alias can evolve later as you keep talking.",
          },
    [locale, rerollsLeft]
  );

  async function handleContinue() {
    setIsSaving(true);

    try {
      await fetch("/api/identity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(identity),
      });

      router.push("/start");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  function handleReroll() {
    if (rerollsLeft <= 0) return;

    const nextIdentity = generateAlias({
      excludeFamilyId: identity.aliasFamily,
      stage: 1,
    });

    setIdentity({
      alias: nextIdentity.alias,
      aliasFamily: nextIdentity.familyId,
      aliasStage: nextIdentity.stage,
    });
    setRerollsLeft((value) => Math.max(0, value - 1));
  }

  return (
    <form className="screen-card space-y-5" onSubmit={(event) => event.preventDefault()}>
      <div className="rounded-[24px] border border-white/10 bg-white/6 p-5">
        <p className="eyebrow">{identityCopy.eyebrow}</p>
        <h2 className="mt-3 app-section-title max-w-[12ch]">{identityCopy.title}</h2>
        <p className="mt-4 max-w-[34ch] text-sm leading-6 text-ink/72">
          {identityCopy.body}
        </p>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-black/6 px-5 py-5">
          <p className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/46">
            {identityCopy.reveal}
          </p>
          <p className="mt-3 font-display text-[2.45rem] leading-[0.94] tracking-[-0.05em] text-ink">
            {identity.alias}
          </p>
          <p className="mt-3 text-sm leading-6 text-ink/62">{identityCopy.evolves}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReroll}
            disabled={rerollsLeft <= 0}
            className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-ink transition hover:bg-white/10 disabled:opacity-40"
          >
            {identityCopy.reroll}
          </button>
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-ink/44">
            {identityCopy.rerollsLeft}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm text-ink/84">{copy.ageRange}</span>
          <select
            defaultValue="25-29"
            className="w-full rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-ink focus:border-bone/40 focus:outline-none"
          >
            <option>22-24</option>
            <option>25-29</option>
            <option>30-34</option>
            <option>35+</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-ink/84">{copy.language}</span>
          <select
            defaultValue="English"
            className="w-full rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-ink focus:border-bone/40 focus:outline-none"
          >
            <option>English</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-sm text-ink/84">{copy.country}</span>
          <input
            defaultValue="France"
            className="w-full rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-ink focus:border-bone/40 focus:outline-none"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-ink/84">{copy.mood}</span>
          <select
            defaultValue={locale === "fr" ? "Curieux" : "Curious"}
            className="w-full rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-ink focus:border-bone/40 focus:outline-none"
          >
            {copy.moods.map((mood) => (
              <option key={mood}>{mood}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm text-ink/84">{copy.interests}</span>
        <input
          defaultValue={locale === "fr" ? "Villes, livres, philosophie, design" : "Cities, books, philosophy, design"}
          className="w-full rounded-[20px] border border-white/10 bg-white/6 px-4 py-3 text-ink focus:border-bone/40 focus:outline-none"
        />
      </label>

      <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/6 p-4">
        {copy.toggles.map((item) => (
          <label key={item} className="flex items-center justify-between gap-4 text-sm text-ink/82">
            <span>{item}</span>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </label>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Link href="/auth" className="soft-link">
          {copy.back}
        </Link>
        <button
          type="button"
          onClick={() => void handleContinue()}
          disabled={isSaving}
          className="rounded-full bg-bone px-5 py-3 text-sm font-semibold text-fog disabled:opacity-50"
        >
          {isSaving
            ? locale === "fr"
              ? "Sauvegarde..."
              : "Saving..."
            : copy.continue}
        </button>
      </div>
    </form>
  );
}
