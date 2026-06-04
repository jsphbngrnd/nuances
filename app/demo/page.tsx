"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, TopBar, ArrowIcon } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";

const PERSONAS = [
  { name: "OracleDuVendredi", glyph: "⚔", color: "#d98a6a" },
  { name: "FlâneurNocturne", glyph: "◍", color: "#9aa6d4" },
  { name: "ÉchoTranquille", glyph: "☾", color: "#8fa0b8" },
  { name: "BrumeNaissante", glyph: "✦", color: "#e0c36a" },
];

const SCRIPT = [
  { who: 0, text: "I think I feel most alive right after I've done something a little frightening — not adrenaline, more like I proved something quiet to myself." },
  { who: 1, text: "That's interesting. For me it's when I stop performing. When I'm not editing the next sentence before I've finished this one." },
  { who: 2, text: "Editing in real time. I do that constantly. Who taught us to do that?" },
  { who: 3, text: "School, probably. Or being watched too early. Alive feels like being unwatched and okay with it." },
  { who: 0, text: "Unwatched and okay with it. I'm keeping that." },
  { who: 1, text: "Can you get there on purpose, or does it only come when you've stopped trying?" },
  { who: 2, text: "Maybe it's neither. Maybe it's just what's left when the performance exhausts itself." },
  { who: 3, text: "That's the most honest thing anyone's said in this room." },
];

export default function DemoPage() {
  const t = useCopy();
  const router = useRouter();
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shown >= SCRIPT.length) {
      const t = setTimeout(() => setShown(0), 3000);
      return () => clearTimeout(t);
    }
    setTyping(true);
    const t1 = setTimeout(() => setTyping(false), 1200);
    const t2 = setTimeout(() => setShown(s => s + 1), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [shown]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [shown, typing]);

  const msgs = SCRIPT.slice(0, shown);

  return (
    <div className="nuance-phone">
      <Screen scroll={false} style={{ display: "flex", flexDirection: "column" }}>
        <TopBar
          sub={t.demo.sub}
          onBack={() => router.push("/")}
          right={<span className="np-chip" style={{ padding: "5px 11px", fontSize: 9 }}>Deep</span>}
        />

        {/* Topic */}
        <div style={{ textAlign: "center", padding: "8px 0 20px" }}>
          <p className="np-eyebrow" style={{ fontSize: 8.5, marginBottom: 10 }}>Topic</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", lineHeight: 1.15, color: "var(--text)" }}>
            "{t.demo.topic}"
          </p>
        </div>

        {/* Persona row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
          {PERSONAS.map(p => (
            <div key={p.name} style={{ textAlign: "center" }}>
              <span style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid var(--line-soft)", background: `${p.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 18, margin: "0 auto" }}>
                {p.glyph}
              </span>
              <p className="np-eyebrow" style={{ fontSize: 6.5, marginTop: 5, maxWidth: 52, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name.split("Du")[0].split("é")[0]}
              </p>
            </div>
          ))}
        </div>

        <div className="np-hairline" style={{ marginBottom: 16 }} />

        {/* Transcript */}
        <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, padding: "2px 2px 8px" }}>
          {msgs.map((msg, i) => {
            const persona = PERSONAS[msg.who];
            return (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ width: 30, height: 30, borderRadius: 999, border: "1px solid var(--line-soft)", background: `${persona.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 15, flex: "0 0 auto" }}>
                  {persona.glyph}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="np-eyebrow" style={{ fontSize: 7.5, marginBottom: 5 }}>{persona.name}</p>
                  <div style={{ padding: "11px 14px", borderRadius: 18, borderTopLeftRadius: 5, background: "var(--panel)", border: "1px solid var(--line-soft)", fontSize: 13, lineHeight: 1.5, color: "var(--text)" }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {typing && shown < SCRIPT.length && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 30, height: 30, borderRadius: 999, border: "1px solid var(--line-soft)", background: `${PERSONAS[SCRIPT[shown]?.who]?.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 15, flex: "0 0 auto" }}>
                {PERSONAS[SCRIPT[shown]?.who]?.glyph}
              </span>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "11px 14px", borderRadius: 18, borderTopLeftRadius: 5, background: "var(--panel)", border: "1px solid var(--line-soft)" }}>
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
            {t.demo.cta} <ArrowIcon />
          </button>
        </div>
      </Screen>
    </div>
  );
}
