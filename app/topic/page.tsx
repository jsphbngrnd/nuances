"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MODES, TOPICS, MODE_DETAIL } from "@/lib/nuance-data";
import { StatusBar, Screen, ModeGlyph } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";

function TopicPageInner() {
  const t = useCopy();
  const router = useRouter();
  const params = useSearchParams();
  const mode = (params.get("mode") || "deep") as keyof typeof TOPICS;
  const matchType = params.get("matchType") || "ai";
  const roomId = params.get("roomId");
  const m = MODES.find(x => x.id === mode)!;
  const pool = TOPICS[mode];
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * pool.length));
  const [rerolls, setRerolls] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const reroll = () => {
    if (rerolls < 2) { setRerolls(r => r + 1); setIdx(i => (i + 1) % pool.length); }
  };

  return (
    <div className="nuance-phone">


      <Screen scroll={false} style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0 14px" }}>
          <button onClick={() => router.push(`/matchmaking?mode=${mode}`)} style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1 }}>
            <p className="np-eyebrow" style={{ fontSize: 9 }}>{m.name} · topic</p>
          </div>
          <span className="np-chip" style={{ padding: "5px 11px" }}>{m.name}</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p className="np-eyebrow" style={{ textAlign: "center" }}>{t.topic.eyebrow}</p>
          <div style={{ position: "relative", marginTop: 18, padding: "40px 26px", borderRadius: 28, border: "1px solid var(--line-soft)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", textAlign: "center", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 240, height: 200, background: "radial-gradient(circle, var(--glow), transparent 68%)" }} />
            <span style={{ position: "relative", fontFamily: "var(--font-display)", fontSize: 18, opacity: 0.7 }}>"</span>
            <blockquote className="np-display" style={{ position: "relative", margin: "8px 0 0", fontSize: 28, lineHeight: 1.08, fontStyle: "italic" }}>{pool[idx]}</blockquote>
          </div>

          {/* Dot pager */}
          <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: 18 }}>
            {pool.map((_, i) => (
              <span key={i} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 999, background: i === idx ? "var(--accent)" : "var(--line)", transition: "width 200ms ease" }} />
            ))}
          </div>

          {/* Partner status */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 22, fontSize: 12, color: "var(--muted)" }}>
            <span style={{ width: 24, height: 24, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 11 }}>V</span>
            <span>VoyageuseSereine {accepted ? t.topic.partnerReady : t.topic.partnerDeciding}</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 10, paddingTop: 10 }}>
          {!accepted ? (
            <>
              <button className="np-btn" style={{ width: "100%" }} onClick={() => setAccepted(true)}>
                {t.topic.accept}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <button onClick={reroll} disabled={rerolls >= 2} className="np-btn np-btn-ghost" style={{ width: "100%", opacity: rerolls >= 2 ? 0.45 : 1 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>
                {rerolls >= 2 ? t.topic.noRerolls : t.topic.reroll(2 - rerolls)}
              </button>
            </>
          ) : (
            <button className="np-btn" style={{ width: "100%" }} onClick={() => {
              const dest = matchType === "real" && roomId
                ? `/room/${roomId}?mode=${mode}&matchType=real`
                : `/room/live?mode=${mode}&matchType=ai`;
              router.push(dest as any);
            }}>
              {t.topic.bothAccepted}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          )}
        </div>
      </Screen>
    </div>
  );
}

import { Suspense } from "react";
export default function TopicPage() { return <Suspense fallback={<div className="nuance-phone" />}><TopicPageInner /></Suspense>; }
