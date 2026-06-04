"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBar, Screen, ArrowIcon } from "@/components/ui";

const PERSONAS = [
  { name: "OracleDuVendredi", glyph: "⚔", color: "#d98a6a" },
  { name: "FlâneurNocturne", glyph: "◍", color: "#9aa6d4" },
  { name: "ÉchoTranquille", glyph: "☾", color: "#8fa0b8" },
  { name: "BrumeNaissante", glyph: "✦", color: "#e0c36a" },
];

const SCRIPT = [
  { who: 0, text: "I think I feel most alive right after I've done something a little frightening — not adrenaline, more like I proved something quiet to myself." },
  { who: 1, text: "That's interesting. For me it's the opposite — it's when I stop performing. When I'm not editing the next sentence before I've finished this one." },
  { who: 2, text: "Editing in real time. I do that constantly. Who taught us to do that?" },
  { who: 3, text: "School, probably. Or being watched too early. Alive feels like being unwatched and okay with it." },
  { who: 0, text: "Unwatched and okay with it. I'm keeping that." },
  { who: 1, text: "The question is: can you get there on purpose, or does it only come when you've stopped trying?" },
];

export default function DemoPage() {
  const router = useRouter();
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    if (shown >= SCRIPT.length) {
      const t = setTimeout(() => setShown(0), 2000);
      return () => clearTimeout(t);
    }
    setTyping(true);
    const t1 = setTimeout(() => setTyping(false), 1200);
    const t2 = setTimeout(() => setShown(s => s + 1), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [shown]);

  const msgs = SCRIPT.slice(0, shown);

  return (
    <div className="nuance-phone">
      <div className="np-notch" />
      <StatusBar />
      <div className="np-body" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TopBar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0 14px" }}>
          <button onClick={() => router.push("/")} style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1 }}>
            <p className="np-eyebrow" style={{ fontSize: 9 }}>Live demo · auto-playing</p>
          </div>
          <span className="np-chip" style={{ padding: "5px 11px", fontSize: 9 }}>Debate</span>
        </div>

        {/* Topic + avatars */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p style={{ margin: "0 0 14px", fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic" }}>"When do you feel most alive?"</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {PERSONAS.map((p, i) => (
              <div key={p.name} style={{ textAlign: "center" }}>
                <span style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: `${p.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18, margin: "0 auto" }}>{p.glyph}</span>
                <p className="np-eyebrow" style={{ fontSize: 7, marginTop: 5, maxWidth: 50, overflow: "hidden", textOverflow: "ellipsis" }}>{p.name.split("D")[0]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, padding: "4px 2px" }}>
          {msgs.map((msg, i) => {
            const persona = PERSONAS[msg.who];
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid var(--line)", background: `${persona.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 14, flex: "0 0 auto" }}>{persona.glyph}</span>
                <div>
                  <p className="np-eyebrow" style={{ fontSize: 7.5, marginBottom: 5 }}>{persona.name}</p>
                  <div style={{ padding: "10px 13px", borderRadius: 16, borderTopLeftRadius: 4, background: "var(--panel)", border: "1px solid var(--line-soft)", fontSize: 12.5, lineHeight: 1.45, color: "var(--text)" }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing */}
          {typing && shown < SCRIPT.length && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 28, height: 28, borderRadius: 999, border: "1px solid var(--line)", background: `${PERSONAS[SCRIPT[shown]?.who]?.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 14, flex: "0 0 auto" }}>
                {PERSONAS[SCRIPT[shown]?.who]?.glyph}
              </span>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "10px 13px", borderRadius: 16, borderTopLeftRadius: 4, background: "var(--panel)", border: "1px solid var(--line-soft)" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 5, height: 5, borderRadius: 999, background: "var(--muted)", animation: `npType 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ paddingTop: 14 }}>
          <button className="np-btn" style={{ width: "100%" }} onClick={() => router.push("/auth?tab=signup")}>
            Try it for real <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
