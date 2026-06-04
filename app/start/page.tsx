"use client";

export const dynamic = "force-dynamic";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MODES, MODE_DETAIL } from "@/lib/nuance-data";
import { StatusBar, Screen, MiniNav, TopBar, ModeGlyph, ArrowIcon } from "@/components/ui";

function StartPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [sel, setSel] = useState(params.get("mode") || "deep");
  const d = MODE_DETAIL[sel as keyof typeof MODE_DETAIL];
  const m = MODES.find(x => x.id === sel)!;

  return (
    <div className="nuance-phone">
      <div className="np-notch" />
      <StatusBar />
      <Screen>
        <TopBar sub="Start" title="Choose the exchange." onBack={() => router.push("/home")} />
        <p style={{ margin: "0 0 18px", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>
          Pick the tone, structure, and duration before you meet the person.
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          {MODES.map(mm => {
            const det = MODE_DETAIL[mm.id as keyof typeof MODE_DETAIL];
            const on = sel === mm.id;
            return (
              <button key={mm.id} onClick={() => setSel(mm.id)} style={{ width: "100%", textAlign: "left", cursor: "pointer", color: "var(--text)", font: "inherit", borderRadius: 22, padding: 18, background: "linear-gradient(180deg, var(--panel-2), var(--panel))", border: "1px solid " + (on ? "var(--accent)" : "var(--line-soft)"), boxShadow: on ? "0 0 0 1px var(--accent), 0 18px 50px rgba(0,0,0,0.4)" : "none", transition: "border-color 160ms ease, box-shadow 160ms ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ flex: "0 0 auto", width: 46, height: 46, borderRadius: 14, border: "1px solid var(--line)", background: "var(--panel)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ModeGlyph glyph={mm.glyph} size={22} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <p className="np-display" style={{ fontSize: 22 }}>{mm.name}</p>
                      <span className="np-eyebrow" style={{ fontSize: 9 }}>{det.duration}</span>
                    </div>
                    <p style={{ margin: "5px 0 0", fontSize: 11.5, lineHeight: 1.35, color: "var(--muted)" }}>{mm.short}</p>
                  </div>
                </div>
                {on && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line-soft)", display: "grid", gap: 14 }}>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "var(--text)" }}>{det.blurb}</p>
                    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                      {([["Structure", det.structure], ["Cadence", det.cadence], ["Tone", det.tone]] as const).map(([k, v]) => (
                        <div key={k}>
                          <p className="np-eyebrow" style={{ fontSize: 8 }}>{k}</p>
                          <p style={{ margin: "5px 0 0", fontSize: 12 }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {det.flow.map((f, i) => (
                        <span key={f} style={{ display: "contents" }}>
                          <span className="np-chip" style={{ textTransform: "none", letterSpacing: "0.02em", fontFamily: "var(--font-sans)", fontSize: 11, padding: "6px 11px" }}>{f}</span>
                          {i < det.flow.length - 1 && <span style={{ color: "var(--faint)" }}>→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button className="np-btn" style={{ width: "100%", marginTop: 20 }} onClick={() => router.push(`/matchmaking?mode=${sel}`)}>
          Find someone for {m.name} <ArrowIcon />
        </button>
        <p style={{ textAlign: "center", marginTop: 14, fontFamily: "var(--font-caps)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--faint)" }}>
          Any language · auto-translated · trust ≥ 0.45
        </p>
      </Screen>
      <MiniNav />
    </div>
  );
}

import { Suspense } from "react";
export default function StartPage() { return <Suspense fallback={<div className="nuance-phone" />}><StartPageInner /></Suspense>; }
