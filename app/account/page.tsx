"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ONB } from "@/lib/nuance-data";
import { StatusBar, Screen, MiniNav, TopBar, Field, PillGroup, ToggleRow, inputStyle } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";

export default function AccountPage() {
  const t = useCopy();
  const router = useRouter();
  const [theme, setTheme] = useState<"night" | "day">("night");
  const [alias, setAlias] = useState("…");
  const [stats, setStats] = useState({ trustScore: "—", reconnectCount: "—", reachEnd: "—" });

  useEffect(() => {
    if (localStorage.getItem("nuance-theme") === "day") setTheme("day");
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      // Fetch profile
      const { data: u } = await supabase.from("users").select("alias, display_name, trust_score").eq("id", user.id).single();
      if (u?.alias) setAlias(u.alias);
      // Fetch reconnect count (mutual)
      const { count: recCount } = await supabase
        .from("reconnects").select("id", { count: "exact", head: true })
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq("user_a_vote", true).eq("user_b_vote", true);
      setStats({
        trustScore: u?.trust_score != null ? Number(u.trust_score).toFixed(3) : "—",
        reconnectCount: String(recCount ?? 0),
        reachEnd: "—", // would need summary table query
      });
    });
  }, []);
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
        <TopBar sub={t.account.sub} title={t.account.title} />

        {/* Identity card */}
        <div style={{ position: "relative", padding: "20px 20px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "linear-gradient(135deg, var(--panel-2), var(--panel))", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, background: "radial-gradient(circle, var(--glow), transparent 68%)" }} />
          <div style={{ position: "relative", display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, flex: "0 0 auto" }}>
              {alias.charAt(0)}
            </span>
            <div>
              <p className="np-display" style={{ fontSize: 22 }}>{alias}</p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--muted)" }}>{t.onboarding.alias.evolves}</p>
            </div>
          </div>
          <div className="np-hairline" style={{ margin: "16px 0" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[[stats.trustScore, t.account.trustScore], [stats.reconnectCount, t.account.reconnectsCount], [stats.reachEnd, t.account.reachEnd]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p className="np-display" style={{ fontSize: 22 }}>{n}</p>
                <p className="np-eyebrow" style={{ fontSize: 8, marginTop: 5 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Display */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 14 }}>{t.account.displaySection}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13.5 }}>{t.account.theme}</span>
            <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
              {([["night", t.account.night], ["day", t.account.day]] as const).map(([themeKey, label]) => (
                <button key={themeKey} onClick={() => applyTheme(themeKey)} style={{ padding: "6px 12px", borderRadius: 999, border: "none", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 10, letterSpacing: "0.14em", background: theme === themeKey ? "var(--accent)" : "transparent", color: theme === themeKey ? "var(--on-accent)" : "var(--text)", transition: "background 160ms ease" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profile */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14, display: "grid", gap: 18 }}>
          <p className="np-eyebrow" style={{ fontSize: 9 }}>{t.account.profileSection}</p>
          <Field label={t.account.namePlaceholder}>
            <input type="text" placeholder={alias} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </Field>
          <Field label={t.account.moodLabel}>
            <PillGroup options={ONB.moods} value={mood} onChange={v => setMood(v as string)} />
          </Field>
          <Field label={t.account.interestsLabel}>
            <PillGroup options={ONB.interests.slice(0, 8)} value={interests} onChange={v => setInterests(v as string[])} multi />
          </Field>
        </div>

        {/* Preferences */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14, display: "grid", gap: 16 }}>
          <p className="np-eyebrow" style={{ fontSize: 9 }}>{t.account.prefsSection}</p>
          <ToggleRow label={t.account.voiceLabel} desc={t.account.voiceDesc} on={voice} onToggle={() => setVoice(v => !v)} />
          <div className="np-hairline" />
          <ToggleRow label={t.account.reconnectsLabel} desc={t.account.reconnectsDesc} on={reconnects} onToggle={() => setReconnects(v => !v)} />
        </div>

        {/* Safety */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 14 }}>{t.account.safetySection}</p>
          {["No harassment, hate, or threats — ever.", "Disagree with the idea, not the human.", "Reports and blocks are always available.", "Moderation reviews every message in near real time."].map((rule, i) => (
            <div key={i} style={{ padding: "10px 0", borderTop: i ? "1px solid var(--line-soft)" : "none", fontSize: 12, lineHeight: 1.45, color: "var(--muted)" }}>{rule}</div>
          ))}
          <button style={{ marginTop: 12, background: "transparent", border: "none", color: "var(--faint)", fontFamily: "var(--font-caps)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>{t.account.blockedPeople}</button>
        </div>

        {/* Account actions */}
        <div style={{ display: "grid", gap: 10 }}>
          <button className="np-btn np-btn-ghost" style={{ width: "100%" }} onClick={handleSignOut}>{t.account.signOut}</button>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)} style={{ width: "100%", padding: "13px 22px", borderRadius: 999, border: "1px solid var(--danger)", background: "transparent", color: "var(--danger)", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>
              {t.account.deleteAccount}
            </button>
          ) : (
            <div style={{ padding: "14px", borderRadius: 16, border: "1px solid var(--danger)", background: "rgba(224,121,111,0.06)", display: "grid", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--danger)" }}>{t.account.deleteConfirm}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button className="np-btn np-btn-ghost" style={{ fontSize: 11 }} onClick={() => setShowDelete(false)}>{t.account.keepAccount}</button>
                <button onClick={handleDelete} style={{ padding: "13px", borderRadius: 999, border: "none", background: "var(--danger)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{t.account.deleteForever}</button>
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
