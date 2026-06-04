"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MODES } from "@/lib/nuance-data";
import { StatusBar, Screen, LiveDot, ModeGlyph, ArrowIcon } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";

export default function LandingPage() {
  const t = useCopy();
  const router = useRouter();
  const [online, setOnline] = useState(142);

  useEffect(() => {
    const timer = setInterval(() => setOnline(o => Math.min(210, Math.max(120, o + (Math.floor(Math.random() * 7) - 3)))), 2600);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { n: online, l: t.landing.stats[0], live: true },
    { n: "72%", l: t.landing.stats[1] },
    { n: MODES.length, l: t.landing.stats[2] },
  ];

  return (
    <div className="nuance-phone">


      <Screen>
        {/* Hero */}
        <div style={{ position: "relative", textAlign: "center", paddingTop: 30 }}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 280, height: 220, background: "radial-gradient(circle, var(--glow), transparent 68%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", fontFamily: "var(--font-display)", fontSize: 34 }}>☾</div>
          <p className="np-eyebrow" style={{ position: "relative", marginTop: 18 }}>{t.landing.eyebrow}</p>
          <h1 className="np-display" style={{ position: "relative", fontSize: 44, marginTop: 16, lineHeight: 0.96 }}>
            {t.landing.hero[0]}<br />{t.landing.hero[1]}<span style={{ fontStyle: "italic" }}>{t.landing.hero[2]}</span>
          </h1>
          <p style={{ position: "relative", margin: "18px auto 0", fontSize: 13.5, lineHeight: 1.5, color: "var(--muted)", maxWidth: "30ch" }}>
            {t.landing.heroSub}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginTop: 30 }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{ padding: "16px 8px", textAlign: "center", borderLeft: i ? "1px solid var(--line-soft)" : "none" }}>
              <p className="np-display" style={{ fontSize: 28, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
                {s.live && <LiveDot size={7} />}
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{s.n}</span>
              </p>
              <p className="np-eyebrow" style={{ fontSize: 8, marginTop: 8 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Mode grid */}
        <div style={{ marginTop: 26 }}>
          <p className="np-eyebrow">{t.landing.modesEyebrow}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {MODES.map(m => (
              <div key={m.id} style={{ borderRadius: 20, border: "1px solid var(--line-soft)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <ModeGlyph glyph={m.glyph} size={22} />
                  <span className="np-eyebrow" style={{ fontSize: 8.5 }}>{m.min}</span>
                </div>
                <p className="np-display" style={{ fontSize: 20, marginTop: 16 }}>{m.name}</p>
                <p style={{ margin: "6px 0 0", fontSize: 11, lineHeight: 1.35, color: "var(--muted)" }}>{m.short}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
          <button className="np-btn" style={{ width: "100%" }} onClick={() => router.push("/auth?tab=signup")}>
            {t.landing.ctaPrimary} <ArrowIcon />
          </button>
          <button className="np-btn np-btn-ghost" style={{ width: "100%" }} onClick={() => router.push("/auth?tab=signin")}>
            {t.landing.ctaSecondary}
          </button>
          <button onClick={() => router.push("/demo")} style={{ background: "transparent", border: "none", color: "var(--faint)", fontFamily: "var(--font-caps)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", marginTop: 6 }}>
            {t.landing.ctaDemo}
          </button>
        </div>
      </Screen>
    </div>
  );
}
