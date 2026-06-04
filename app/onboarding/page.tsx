"use client";

export const dynamic = "force-dynamic";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ONB } from "@/lib/nuance-data";
import { StatusBar, Screen, StepDots, Field, PillGroup, ToggleRow, ArrowIcon, inputStyle } from "@/components/ui";

const TOTAL = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const browserLang = navigator.language || (navigator as any).userLanguage || "";
    return browserLang.toLowerCase().startsWith("fr") ? "fr" : "en";
  });
  const [scrolledEnd, setScrolledEnd] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [aliasIdx, setAliasIdx] = useState(0);
  const [rerolls, setRerolls] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("25–34");
  const [country, setCountry] = useState("France");
  const [mood, setMood] = useState("Curious");
  const [interests, setInterests] = useState<string[]>(["Philosophy", "Music"]);
  const [voice, setVoice] = useState(true);
  const [reconnects, setReconnects] = useState(true);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const next = () => step < TOTAL - 1 ? setStep(s => s + 1) : finish();
  const back = () => step > 0 ? setStep(s => s - 1) : router.push("/auth?tab=signup");
  const canAdvance = step !== 2 || accepted;

  async function finish() {
    setSaving(true);
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: name || ONB.aliases[aliasIdx],
          alias: ONB.aliases[aliasIdx],
          aliasFamily: "oracle",
          aliasStage: 1,
          ageRange: age,
          language: lang,
          country,
          mood,
          interests: interests.join(", "),
          voiceEnabled: voice,
          reconnectEnabled: reconnects,
        }),
      });
    } catch { /* continue even if save fails */ }
    router.push("/home");
  }

  const onRulesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) setScrolledEnd(true);
  };

  return (
    <div className="nuance-phone">
      <div className="np-notch" />
      <StatusBar />
      <div className="np-body" style={{ display: "flex", flexDirection: "column", paddingBottom: 6, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 18 }}>
          <button onClick={back} aria-label="Back" style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <StepDots total={TOTAL} active={step} />
          <span className="np-eyebrow" style={{ fontSize: 9 }}>{step + 1}/{TOTAL}</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }} ref={scrollRef}>

          {/* Step 1 — Language */}
          {step === 0 && (
            <div>
              <p className="np-eyebrow">Step one</p>
              <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>Choose your language.</h1>
              <p style={{ margin: "12px 0 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>
                Everything you read and hear is shown in this language. Talk to anyone in the world — NUANCE auto-translates every message and voice line with AI, so language is never a wall.
              </p>
              <div style={{ display: "grid", gap: 10, marginTop: 24 }}>
                {ONB.languages.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 18, cursor: "pointer", color: "var(--text)", font: "inherit", background: lang === l.code ? "linear-gradient(180deg, var(--panel-2), var(--panel))" : "var(--panel)", border: "1px solid " + (lang === l.code ? "var(--accent)" : "var(--line-soft)"), boxShadow: lang === l.code ? "0 0 0 1px var(--accent)" : "none" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 16 }}>{l.native}</p>
                      <p className="np-eyebrow" style={{ fontSize: 8.5, marginTop: 5 }}>{l.label}</p>
                    </div>
                    {lang === l.code && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, padding: "10px 14px", borderRadius: 14, border: "1px solid var(--line-soft)", background: "var(--panel)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h7M9 5v3c0 3.5-2 6-5 7" /><path d="M7 11c1 2 3 3.5 5 4" /><path d="m13 19 4-9 4 9M14.5 16h5" /></svg>
                <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "var(--faint)" }}>Pick French and you can still talk to someone in Spanish, Japanese, Arabic — NUANCE handles the rest.</p>
              </div>
            </div>
          )}

          {/* Step 2 — Intro */}
          {step === 1 && (
            <div>
              <p className="np-eyebrow">Step two</p>
              <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>How NUANCE works.</h1>
              <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
                {ONB.intro.map(item => (
                  <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 16, border: "1px solid var(--line-soft)", background: "var(--panel)" }}>
                    <span style={{ flex: "0 0 auto", width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18 }}>{item.glyph}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{item.title}</p>
                      <p style={{ margin: "5px 0 0", fontSize: 12, lineHeight: 1.45, color: "var(--muted)" }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Conduct */}
          {step === 2 && (
            <div>
              <p className="np-eyebrow">Step three</p>
              <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>The conduct rules.</h1>
              <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--muted)" }}>Scroll to the end to continue.</p>
              <div onScroll={onRulesScroll} style={{ maxHeight: 250, overflowY: "auto", marginTop: 18, padding: "16px", borderRadius: 16, border: "1px solid var(--line-soft)", background: "var(--panel)", display: "grid", gap: 14 }}>
                {ONB.rules.map((rule, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <span className="np-eyebrow" style={{ fontSize: 8, flex: "0 0 auto", marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "var(--text)" }}>{rule}</p>
                  </div>
                ))}
                <div style={{ height: 4 }} />
              </div>
              <button onClick={() => scrolledEnd && setAccepted(a => !a)} style={{ width: "100%", marginTop: 14, display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: "1px solid " + (scrolledEnd ? "var(--line)" : "var(--line-soft)"), background: "var(--panel)", cursor: scrolledEnd ? "pointer" : "default", opacity: scrolledEnd ? 1 : 0.5, color: "var(--text)", font: "inherit", textAlign: "left" }}>
                <span style={{ flex: "0 0 auto", width: 20, height: 20, borderRadius: 6, border: "1px solid " + (accepted ? "var(--accent)" : "var(--line)"), background: accepted ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {accepted && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--on-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>}
                </span>
                <span style={{ fontSize: 12.5 }}>I'll speak to the person, not the room.</span>
              </button>
            </div>
          )}

          {/* Step 4 — Alias */}
          {step === 3 && (
            <div>
              <p className="np-eyebrow">Step four</p>
              <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>Your alias.</h1>
              <p style={{ margin: "10px 0 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>NUANCE doesn't need your real name. It gives you a living alias — memorable and still anonymous.</p>
              <div style={{ position: "relative", marginTop: 24, padding: "28px 22px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 160, background: "radial-gradient(circle, var(--glow), transparent 68%)" }} />
                <p className="np-eyebrow" style={{ position: "relative", fontSize: 9 }}>Your identity</p>
                <p className="np-display" style={{ position: "relative", fontSize: 30, marginTop: 10, fontStyle: "italic" }}>{ONB.aliases[aliasIdx]}</p>
                <p style={{ position: "relative", margin: "8px 0 0", fontSize: 11, color: "var(--muted)" }}>Stage 1 · Family of the night</p>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
                  <button onClick={() => { if (rerolls < 2) { setRerolls(r => r + 1); setAliasIdx(i => (i + 1) % ONB.aliases.length); } }} disabled={rerolls >= 2} className="np-btn np-btn-ghost" style={{ fontSize: 11, padding: "8px 14px", opacity: rerolls >= 2 ? 0.45 : 1 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
                    Reroll
                  </button>
                  <span className="np-eyebrow" style={{ fontSize: 8 }}>{2 - rerolls} reroll{2 - rerolls !== 1 ? "s" : ""} left</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Profile */}
          {step === 4 && (
            <div>
              <p className="np-eyebrow">Step five</p>
              <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>A few details.</h1>
              <p style={{ margin: "10px 0 16px", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>Optional — but it helps us match you better. Never public.</p>
              <div style={{ display: "grid", gap: 20 }}>
                <Field label="Display name (optional)">
                  <input type="text" placeholder="Or leave blank to use your alias" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                </Field>
                <Field label="Age range">
                  <PillGroup options={ONB.ages} value={age} onChange={v => setAge(v as string)} />
                </Field>
                <Field label="Country">
                  <PillGroup options={ONB.countries} value={country} onChange={v => setCountry(v as string)} />
                </Field>
                <Field label="Mood right now">
                  <PillGroup options={ONB.moods} value={mood} onChange={v => setMood(v as string)} />
                </Field>
                <Field label="Interests (multi-select)">
                  <PillGroup options={ONB.interests} value={interests} onChange={v => setInterests(v as string[])} multi />
                </Field>
                <div style={{ padding: "16px 18px", borderRadius: 18, border: "1px solid var(--line-soft)", background: "var(--panel)", display: "grid", gap: 18 }}>
                  <ToggleRow label="Voice rooms" desc="Use push-to-talk for voice alongside text." on={voice} onToggle={() => setVoice(v => !v)} />
                  <div className="np-hairline" />
                  <ToggleRow label="Reconnects" desc="Let people request another conversation after a room." on={reconnects} onToggle={() => setReconnects(v => !v)} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div style={{ paddingTop: 14 }}>
          <button className="np-btn" style={{ width: "100%", opacity: canAdvance ? 1 : 0.4 }} disabled={!canAdvance || saving} onClick={next}>
            {saving ? "Just a moment…" : step === TOTAL - 1 ? "Enter NUANCE" : "Continue"} {!saving && <ArrowIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
