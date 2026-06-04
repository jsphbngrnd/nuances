"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MODES, SUMMARY } from "@/lib/nuance-data";
import { StatusBar, Screen, MiniNav, LiveDot, ModeGlyph, ArrowIcon } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";
import { createClient } from "@/lib/supabase/client";


export default function HomePage() {
  const t = useCopy();
  const router = useRouter();
  const [online, setOnline] = useState(142);
  const [selected, setSelected] = useState("deep");
  const [alias, setAlias] = useState("…");
  const [reconnects, setReconnects] = useState<{ id: string; alias: string }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setOnline(o => Math.min(210, Math.max(120, o + (Math.floor(Math.random() * 5) - 2)))), 3000);
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      // Fetch alias
      const { data: u } = await supabase.from("users").select("alias").eq("id", user.id).single();
      if (u?.alias) setAlias(u.alias);
      // Fetch mutual reconnects (both voted yes) — only show if populated
      const { data: recs } = await supabase
        .from("reconnects")
        .select("id, user_a_id, user_b_id")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq("user_a_vote", true).eq("user_b_vote", true)
        .limit(2);
      if (recs?.length) {
        const enriched = await Promise.all(recs.map(async r => {
          const pid = r.user_a_id === user.id ? r.user_b_id : r.user_a_id;
          const { data: p } = await supabase.from("users").select("alias").eq("id", pid).single();
          return { id: r.id, alias: p?.alias ?? "Unknown" };
        }));
        setReconnects(enriched);
      }
    });
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="nuance-phone">


      <Screen>
        {/* Profile chip */}
        <button onClick={() => router.push("/account")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 999, border: "1px solid var(--line-soft)", background: "var(--panel)", cursor: "pointer", color: "var(--text)", font: "inherit", marginBottom: 22 }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 13, flex: "0 0 auto" }}>
            {alias.charAt(0)}
          </span>
          <span className="np-eyebrow" style={{ fontSize: 9, flex: 1, textAlign: "left" }}>{t.home.greeting} · {alias}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* Hero */}
        <div style={{ position: "relative", textAlign: "center", marginBottom: 28 }}>
          <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(circle, var(--glow), transparent 68%)", pointerEvents: "none" }} />
          <h1 className="np-display" style={{ position: "relative", fontSize: 38 }}>{t.home.title}</h1>
          <p style={{ position: "relative", margin: "12px auto 0", fontSize: 12.5, lineHeight: 1.5, color: "var(--muted)", maxWidth: "28ch" }}>
            {t.home.sub}
          </p>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "8px 15px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
            <LiveDot size={7} />
            <span className="np-eyebrow" style={{ fontSize: 9 }}>{online} {t.home.online}</span>
          </div>
        </div>

        {/* Mode grid */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span className="np-eyebrow" style={{ fontSize: 9 }}>{t.home.pickAtmosphere}</span>
            <span className="np-eyebrow" style={{ fontSize: 9 }}>{t.home.fourModes}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {MODES.map(m => {
              const on = selected === m.id;
              return (
                <button key={m.id} onClick={() => setSelected(m.id)} style={{ textAlign: "left", cursor: "pointer", color: "var(--text)", font: "inherit", borderRadius: 20, padding: "14px 14px 16px", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", border: "1px solid " + (on ? "var(--accent)" : "var(--line-soft)"), boxShadow: on ? "0 0 0 1px var(--accent)" : "none", transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease", transform: on ? "translateY(-2px)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <ModeGlyph glyph={m.glyph} size={22} />
                    <span className="np-eyebrow" style={{ fontSize: 8.5 }}>{m.min}</span>
                  </div>
                  <p className="np-display" style={{ fontSize: 22, marginTop: 14 }}>{m.name}</p>
                  <p style={{ margin: "5px 0 0", fontSize: 11, lineHeight: 1.35, color: "var(--muted)" }}>{m.short}</p>
                </button>
              );
            })}
          </div>
          <button className="np-btn" style={{ width: "100%", marginTop: 12 }} onClick={() => router.push(`/start?mode=${selected}`)}>
            {t.home.openModes} <ArrowIcon />
          </button>
        </div>

        {/* Quote of the day */}
        <div style={{ position: "relative", padding: "22px 20px", borderRadius: 28, border: "1px solid var(--line-soft)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 220, height: 180, background: "radial-gradient(circle, var(--glow), transparent 68%)" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            <p className="np-eyebrow" style={{ fontSize: 9 }}>{t.home.quoteEyebrow}</p>
            <span className="np-chip" style={{ padding: "4px 10px", fontSize: 9 }}>Deep</span>
          </div>
          <blockquote className="np-display" style={{ position: "relative", fontSize: 27, fontStyle: "italic", lineHeight: 1.1, marginBottom: 16 }}>
            "{SUMMARY.followup}"
          </blockquote>
          <div className="np-hairline" />
          <p style={{ marginTop: 12, fontSize: 10, color: "var(--faint)" }}>{SUMMARY.topic}</p>
          <p style={{ marginTop: 4, fontSize: 9, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "var(--font-caps)" }}>From the NUANCE community</p>
        </div>

        {/* Reconnects preview — only shown when there are mutual reconnects */}
        {reconnects.length > 0 && (
          <div style={{ borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 8, overflow: "hidden" }}>
            <div style={{ padding: "16px 18px 14px" }}>
              <p className="np-eyebrow" style={{ fontSize: 9 }}>{t.home.reconnectsEyebrow}</p>
            </div>
            <div style={{ display: "grid", gap: 0 }}>
              {reconnects.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderTop: "1px solid var(--line-soft)" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 13, flex: "0 0 auto" }}>{r.alias.charAt(0)}</span>
                  <p style={{ margin: 0, fontSize: 13, flex: 1 }}>{r.alias}</p>
                  <span className="np-eyebrow" style={{ fontSize: 8, color: "var(--positive)" }}>Mutual</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line-soft)" }}>
              <button onClick={() => router.push("/reconnects")} style={{ background: "transparent", border: "none", color: "var(--faint)", fontFamily: "var(--font-caps)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", padding: 0 }}>{t.home.reconnectsLink}</button>
            </div>
          </div>
        )}
      </Screen>
      <MiniNav />
    </div>
  );
}
