"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MODES, MODE_DETAIL } from "@/lib/nuance-data";
import { StatusBar, Screen, ModeGlyph } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";


function MatchmakingPageInner() {
  const t = useCopy();
  const router = useRouter();
  const params = useSearchParams();
  const mode = (params.get("mode") || "deep") as keyof typeof MODE_DETAIL;
  const m = MODES.find(x => x.id === mode)!;

  const [secs, setSecs] = useState(0);
  const [matched, setMatched] = useState(false);
  const [matchType, setMatchType] = useState<"real" | "ai" | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [debugMsg, setDebugMsg] = useState("");

  useEffect(() => {
    const tick = setInterval(() => setSecs(s => s + 1), 1000);
    let realMatchFound = false;

    // Enter queue immediately
    fetch("/api/matchmaking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "enter", mode }),
    }).then(r => r.json()).then(data => {
      if (data.error) setDebugMsg(data.error);
      if (data.matched && !realMatchFound) {
        realMatchFound = true;
        clearInterval(pollReal);
        setRoomId(data.roomId);
        setMatchType("real");
        setMatched(true);
      }
    }).catch(() => {});

    // Poll every 2s for a human match
    const pollReal = setInterval(async () => {
      try {
        const res = await fetch("/api/matchmaking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "poll", mode }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.matched && !realMatchFound) {
            realMatchFound = true;
            clearInterval(pollReal);
            setRoomId(data.roomId);
            setMatchType("real");
            setMatched(true);
          }
        }
      } catch { /* skip */ }
    }, 2000);

    // No AI fallback — keep searching until user cancels
    return () => { clearInterval(tick); clearInterval(pollReal); };
  }, [mode]);

  useEffect(() => {
    if (!matched) return;
    // Both real and AI matches go through topic selection first
    const dest = matchType === "real" && roomId
      ? `/topic?mode=${mode}&matchType=real&roomId=${roomId}`
      : `/topic?mode=${mode}&matchType=ai`;
    const t = setTimeout(() => router.push(dest as any), 1400);
    return () => clearTimeout(t);
  }, [matched]);

  const elapsed = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="nuance-phone">


      <Screen scroll={false} style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0 14px" }}>
          <button onClick={() => router.push("/start")} style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1 }} />
          <span className="np-eyebrow" style={{ fontSize: 9 }}>{elapsed}</span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ position: "relative", width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{ position: "absolute", inset: 0, borderRadius: 999, border: "1px solid var(--line)", animation: `npRadar 2.8s ease-out ${i * 0.9}s infinite`, opacity: 0 }} />
            ))}
            <span style={{ position: "absolute", width: 100, height: 100, borderRadius: 999, background: "radial-gradient(circle, var(--glow), transparent 70%)" }} />
            <span style={{ position: "relative", width: 70, height: 70, borderRadius: 999, border: "1px solid var(--line)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 400ms ease", transform: matched ? "scale(1.06)" : "none" }}>
              <ModeGlyph glyph={matched ? "☾" : m.glyph} size={30} />
            </span>
          </div>

          <p className="np-eyebrow" style={{ marginTop: 30 }}>
            {matched ? (matchType === "real" ? t.matchmaking.realMatch : t.matchmaking.matchFound) : t.matchmaking.searching}
          </p>
          <h1 className="np-display" style={{ fontSize: 30, marginTop: 14, maxWidth: "16ch" }}>
            {matched ? t.matchmaking.found : t.matchmaking.looking(m.name.toLowerCase())}
          </h1>
          <p style={{ margin: "14px auto 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)", maxWidth: "28ch" }}>
            {matched
              ? matchType === "real"
                ? t.matchmaking.subRealFound
                : t.matchmaking.subAiFound
              : t.matchmaking.subSearching}
          </p>

          {debugMsg && (
            <p style={{ margin: "12px auto 0", fontSize: 10, color: "var(--danger)", maxWidth: "28ch", textAlign: "center" }}>{debugMsg}</p>
          )}

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, padding: "8px 15px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)" }}>
            <ModeGlyph glyph={m.glyph} size={15} />
            <span className="np-eyebrow" style={{ fontSize: 9 }}>{m.name} · {MODE_DETAIL[mode].duration}</span>
          </div>
        </div>

        <div style={{ paddingTop: 10 }}>
          <button className="np-btn np-btn-ghost" style={{ width: "100%" }} onClick={() => router.push("/start")}>
            {t.matchmaking.cancel}
          </button>
        </div>
      </Screen>
    </div>
  );
}

import { Suspense } from "react";
export default function MatchmakingPage() {
  return <Suspense fallback={<div className="nuance-phone" />}><MatchmakingPageInner /></Suspense>;
}
