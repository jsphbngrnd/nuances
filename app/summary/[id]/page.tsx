"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SUMMARY, MODES } from "@/lib/nuance-data";
import { StatusBar, Screen, ArrowIcon } from "@/components/ui";

function SummaryPageInner() {
  const router = useRouter();
  const search = useSearchParams();
  const mode = search.get("mode") || "deep";
  const m = MODES.find(x => x.id === mode)!;
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  return (
    <div className="nuance-phone">
      <div className="np-notch" />
      <StatusBar />
      <Screen>
        {/* TopBar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0 14px" }}>
          <button onClick={() => router.push("/home")} style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1 }}>
            <p className="np-eyebrow" style={{ fontSize: 9 }}>Summary</p>
          </div>
          <span className="np-chip" style={{ padding: "5px 11px" }}>{m.name}</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>☾</div>
          <h1 className="np-display" style={{ fontSize: 30 }}>That's a wrap.</h1>
          <p style={{ margin: "10px auto 0", fontSize: 12, color: "var(--muted)", maxWidth: "30ch" }}>
            {SUMMARY.duration} with {SUMMARY.alias} on "{SUMMARY.topic}"
          </p>
        </div>

        {/* What happened */}
        <div style={{ padding: "18px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
          <p className="np-eyebrow" style={{ fontSize: 9 }}>What happened</p>
          <p style={{ margin: "10px 0 12px", fontSize: 12.5, lineHeight: 1.55, color: "var(--text)" }}>{SUMMARY.text}</p>
          <div className="np-hairline" />
          <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
            <div><p className="np-eyebrow" style={{ fontSize: 8 }}>Tone</p><p style={{ margin: "4px 0 0", fontSize: 12 }}>{SUMMARY.tone}</p></div>
            <div><p className="np-eyebrow" style={{ fontSize: 8 }}>Length</p><p style={{ margin: "4px 0 0", fontSize: 12 }}>{SUMMARY.duration}</p></div>
          </div>
        </div>

        {/* Agreement */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 10 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 12 }}>Where you met</p>
          {SUMMARY.agreement.map(a => (
            <div key={a} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto", marginTop: 1 }}><path d="M20 6L9 17l-5-5" /></svg>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.4 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Disagreement */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 10 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 12 }}>Where you differed</p>
          {SUMMARY.disagreement.map(d => (
            <div key={d} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flex: "0 0 auto", fontFamily: "var(--font-display)", fontSize: 16, lineHeight: 1, marginTop: -2, color: "var(--muted)" }}>↔</span>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.4 }}>{d}</p>
            </div>
          ))}
        </div>

        {/* Themes */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 10 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 12 }}>Themes</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {SUMMARY.tags.map(t => (
              <span key={t} className="np-chip" style={{ textTransform: "none", letterSpacing: "0.02em", fontFamily: "var(--font-sans)", fontSize: 12, padding: "7px 12px" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Follow-up */}
        <div style={{ padding: "20px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", marginBottom: 10 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>A question to sit with</p>
          <p className="np-display" style={{ fontSize: 21, fontStyle: "italic", lineHeight: 1.15 }}>{SUMMARY.followup}</p>
        </div>

        {/* Recommendations */}
        <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 14 }}>Because you talked about this</p>
          {SUMMARY.recs.map(r => (
            <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid var(--line-soft)" }}>
              <div style={{ flex: 1 }}>
                <p className="np-eyebrow" style={{ fontSize: 8 }}>{r.kind}</p>
                <p style={{ margin: "4px 0 2px", fontSize: 13 }}>{r.title}</p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--muted)" }}>{r.source}</p>
              </div>
              <ArrowIcon />
            </div>
          ))}
        </div>

        {/* Reconnect vote */}
        <div style={{ padding: "18px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
          <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>Reconnect?</p>
          {vote === null ? (
            <>
              <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>If both of you say yes, a private thread opens — no open DMs until then.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="np-btn np-btn-ghost" style={{ width: "100%" }} onClick={() => setVote("no")}>Not this time</button>
                <button className="np-btn" style={{ width: "100%" }} onClick={() => setVote("yes")}>Yes, reconnect</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              {vote === "yes" ? (
                <>
                  <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.5 }}>Your vote is in. If {SUMMARY.alias} also votes yes, a thread will appear in your reconnects.</p>
                  <button className="np-btn" onClick={() => router.push("/reconnects")}>See reconnects <ArrowIcon /></button>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>No reconnect — that's okay. The conversation still happened.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <button className="np-btn" style={{ width: "100%" }} onClick={() => router.push("/start")}>
          Talk to someone new <ArrowIcon />
        </button>
      </Screen>
    </div>
  );
}

import { Suspense } from "react";
export default function SummaryPage() { return <Suspense fallback={<div className="nuance-phone" />}><SummaryPageInner /></Suspense>; }
// params not used but kept for route compat
