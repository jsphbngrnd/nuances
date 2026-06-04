"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ONB } from "@/lib/nuance-data";
import { StatusBar, Screen, MiniNav, TopBar, Field, PillGroup, ToggleRow, inputStyle } from "@/components/ui";

const ALIAS = "OracleDuVendredi";

export default function AccountPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"night" | "day">("night");

  useEffect(() => {
    if (localStorage.getItem("nuance-theme") === "day") setTheme("day");
  }, []);
  const [lang, setLang] = useState("en");
  const [name, setName] = useState("");
  const [mood, setMood] = useState("Curious");
  const [interests, setInterests] = useState<string[]>(["Philosophy"]);
  const [voice, setVoice] = useState(true);
  const [reconnects, setReconnects] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  function applyTheme(t: "night" | "day") {
    setTheme(t);
    localStorage.setItem("nuance-theme", t);
    document.documentElement.dataset.theme = t === "day" ? "day" : "";
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDelete() {
    if (!showDelete) { setShowDelete(true); return; }
    await fetch("/api/user", { method: "DELETE" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="nuance-phone">


      <Screen>
        <TopBar sub="Account" title="You, quietly." />

        {/* Identity card */}
        <div style={{ position: "relative", padding: "20px 20px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "linear-gradient(135deg, var(--panel-2), var(--panel))", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "radial-gradient(circle, var(--glow), transparent 68%)" }} />
          <div style={{ position: "relative", display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, flex: "0 0 auto" }}>
              {ALIAS.charAt(0)}
            </span>
            <div>
              <p className="np-display" style={{ fontSize: 22 }}>{ALIAS}</p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--muted)" }}>Stage 1 · Family of the night</p>
            </div>
          </div>
          <div className="np-hairline" style={{ margin: "16px 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[["0.910", "Trust score"], ["3", "Reconnects"], ["72%", "Reach end"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p className="np-display" style={{ fontSize: 22 }}>{n}</p>
                <p className="np-eyebrow" style={{ fontSize: 8, marginTop: 5 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Display */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 14 }}>Display</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 13.5 }}>Language</span>
            <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
              {[["en", "EN"], ["fr", "FR"]].map(([code, label]) => (
                <button key={code} onClick={() => setLang(code)} style={{ padding: "6px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 10, letterSpacing: "0.14em", background: lang === code ? "var(--accent)" : "transparent", color: lang === code ? "var(--on-accent)" : "var(--text)", transition: "background 160ms ease" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13.5 }}>Theme</span>
            <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
              {([["night", "Night"], ["day", "Day"]] as const).map(([t, label]) => (
                <button key={t} onClick={() => applyTheme(t)} style={{ padding: "6px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 10, letterSpacing: "0.14em", background: theme === t ? "var(--accent)" : "transparent", color: theme === t ? "var(--on-accent)" : "var(--text)", transition: "background 160ms ease" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14, display: "grid", gap: 18 }}>
          <p className="np-eyebrow" style={{ fontSize: 9 }}>Profile</p>
          <Field label="Display name">
            <input type="text" placeholder={ALIAS} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Mood">
            <PillGroup options={ONB.moods} value={mood} onChange={v => setMood(v as string)} />
          </Field>
          <Field label="Interests">
            <PillGroup options={ONB.interests.slice(0, 8)} value={interests} onChange={v => setInterests(v as string[])} multi />
          </Field>
        </div>

        {/* Preferences */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14, display: "grid", gap: 16 }}>
          <p className="np-eyebrow" style={{ fontSize: 9 }}>Preferences</p>
          <ToggleRow label="Voice rooms" desc="Use push-to-talk for voice alongside text." on={voice} onToggle={() => setVoice(v => !v)} />
          <div className="np-hairline" />
          <ToggleRow label="Reconnects" desc="Let people request another conversation after a room." on={reconnects} onToggle={() => setReconnects(v => !v)} />
        </div>

        {/* Safety */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 14 }}>Safety</p>
          {["No harassment, hate, or threats — ever.", "Disagree with the idea, not the human.", "Reports and blocks are always available.", "Moderation reviews every message in near real time."].map((rule, i) => (
            <div key={i} style={{ padding: "10px 0", borderTop: i ? "1px solid var(--line-soft)" : "none", fontSize: 12, lineHeight: 1.45, color: "var(--muted)" }}>{rule}</div>
          ))}
          <button style={{ marginTop: 12, background: "transparent", border: "none", color: "var(--faint)", fontFamily: "var(--font-caps)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>Manage blocked people →</button>
        </div>

        {/* Account actions */}
        <div style={{ display: "grid", gap: 10 }}>
          <button className="np-btn np-btn-ghost" style={{ width: "100%" }} onClick={handleSignOut}>Sign out</button>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} style={{ width: "100%", padding: "13px 22px", borderRadius: 999, border: "1px solid var(--danger)", background: "transparent", color: "var(--danger)", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
              Delete account
            </button>
          ) : (
            <div style={{ padding: "14px", borderRadius: 16, border: "1px solid var(--danger)", background: "rgba(224,121,111,0.06)", display: "grid", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--danger)" }}>This is permanent. Your alias, conversations, and reconnects will be gone.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button className="np-btn np-btn-ghost" style={{ fontSize: 11 }} onClick={() => setShowDelete(false)}>Keep account</button>
                <button onClick={handleDelete} style={{ padding: "13px", borderRadius: 999, border: "none", background: "var(--danger)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>Delete forever</button>
              </div>
            </div>
          )}
        </div>
        <div style={{ height: 8 }} />
      </Screen>
      <MiniNav />
    </div>
  );
}
