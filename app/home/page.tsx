"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MODES, SUMMARY } from "@/lib/nuance-data";
import { StatusBar, Screen, MiniNav, LiveDot, ModeGlyph, ArrowIcon } from "@/components/ui";

const ALIAS = "OracleDuVendredi";
const RECONNECTS_PREVIEW = [
  { name: "Mara", mode: "Late Night", status: "Mutual", topic: "What are you carrying that people don't see?" },
  { name: "Ilan", mode: "Debate", status: "Pending", topic: "Does money make people freer?" },
];

export default function HomePage() {
  const router = useRouter();
  const [online, setOnline] = useState(142);
  const [selected, setSelected] = useState("deep");

  useEffect(() => {
    const t = setInterval(() => setOnline(o => Math.min(210, Math.max(120, o + (Math.floor(Math.random() * 5) - 2)))), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="nuance-phone">
      <div className="np-notch" />
      <StatusBar />
      <Screen>
        {/* Profile chip */}
        <button onClick={() => router.push("/account")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 999, border: "1px solid var(--line-soft)", background: "var(--panel)", cursor: "pointer", color: "var(--text)", font: "inherit", marginBottom: 22 }}>
          <span style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 13, flex: "0 0 auto" }}>
            {ALIAS.charAt(0)}
          </span>
          <span className="np-eyebrow" style={{ fontSize: 9, flex: 1, textAlign: "left" }}>Good evening · {ALIAS}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        {/* Hero */}
        <div style={{ position: "relative", textAlign: "center", marginBottom: 28 }}>
          <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(circle, var(--glow), transparent 68%)", pointerEvents: "none" }} />
          <h1 className="np-display" style={{ position: "relative", fontSize: 38 }}>Talk to someone real.</h1>
          <p style={{ position: "relative", margin: "12px auto 0", fontSize: 12.5, lineHeight: 1.5, color: "var(--muted)", maxWidth: "28ch" }}>
            A calmer social product: structured rooms, private reconnects, and no performance layer.
          </p>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "8px 15px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
            <LiveDot size={7} />
            <span className="np-eyebrow" style={{ fontSize: 9 }}>{online} online now</span>
          </div>
        </div>

        {/* Mode grid */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span className="np-eyebrow" style={{ fontSize: 9 }}>Pick the atmosphere</span>
            <span className="np-eyebrow" style={{ fontSize: 9 }}>Four modes</span>
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
            Open exchange modes <ArrowIcon />
          </button>
        </div>

        {/* Quote of the day */}
        <div style={{ position: "relative", padding: "22px 20px", borderRadius: 28, border: "1px solid var(--line-soft)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 220, height: 180, background: "radial-gradient(circle, var(--glow), transparent 68%)" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
            <p className="np-eyebrow" style={{ fontSize: 9 }}>Quote of the day</p>
            <span className="np-chip" style={{ padding: "4px 10px", fontSize: 9 }}>Deep</span>
          </div>
          <blockquote className="np-display" style={{ position: "relative", fontSize: 27, fontStyle: "italic", lineHeight: 1.1, marginBottom: 16 }}>
            "{SUMMARY.followup}"
          </blockquote>
          <div className="np-hairline" />
          <p style={{ marginTop: 12, fontSize: 10, color: "var(--faint)" }}>{SUMMARY.topic}</p>
          <p style={{ marginTop: 4, fontSize: 9, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.18em", fontFamily: "var(--font-caps)" }}>From the NUANCE community</p>
        </div>

        {/* Reconnects preview */}
        <div style={{ padding: "18px 18px 20px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p className="np-eyebrow" style={{ fontSize: 9 }}>Reconnects</p>
            <button onClick={() => router.push("/reconnects")} style={{ background: "transparent", border: "none", color: "var(--faint)", fontFamily: "var(--font-caps)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer" }}>Open →</button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {RECONNECTS_PREVIEW.map(r => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 14, border: "1px solid var(--line-soft)", background: "var(--panel-2)" }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 13, flex: "0 0 auto" }}>{r.name.charAt(0)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name} · {r.mode}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.topic}</p>
                </div>
                <span className="np-eyebrow" style={{ fontSize: 8, color: r.status === "Mutual" ? "var(--positive)" : "var(--faint)", flex: "0 0 auto" }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </Screen>
      <MiniNav />
    </div>
  );
}
