"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MODES, MODE_DETAIL, TOPICS, ROOM_SCRIPT } from "@/lib/nuance-data";
import { StatusBar, LiveDot } from "@/components/ui";

const PER = 5 * 60;

function RoomPageInner({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const search = useSearchParams();
  const mode = (search.get("mode") || "deep") as keyof typeof MODE_DETAIL;
  const m = MODES.find(x => x.id === mode)!;

  const [shown, setShown] = useState(2);
  const [youLeft, setYouLeft] = useState(PER);
  const [themLeft, setThemLeft] = useState(PER);
  const [draft, setDraft] = useState("");
  const [voice, setVoice] = useState(false);
  const [menu, setMenu] = useState(false);
  const [typing, setTyping] = useState(false);
  const [blockedNote, setBlockedNote] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextMsg = shown < ROOM_SCRIPT.length ? ROOM_SCRIPT[shown] : null;
  const active = nextMsg && nextMsg.who !== "system" ? nextMsg.who :
    shown > 0 ? ROOM_SCRIPT[shown - 1].who : "them";

  // Blitz clocks
  useEffect(() => {
    const t = setInterval(() => {
      if (active === "you") setYouLeft(v => Math.max(0, v - 1));
      else setThemLeft(v => Math.max(0, v - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [active]);

  // Auto-play transcript
  useEffect(() => {
    if (shown >= ROOM_SCRIPT.length) { setTyping(false); return; }
    setTyping(false);
    const showDots = ROOM_SCRIPT[shown]?.who === "them";
    const t1 = setTimeout(() => { if (showDots) setTyping(true); }, 650);
    const t2 = setTimeout(() => { setTyping(false); setShown(s => s + 1); }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [shown]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [shown, blockedNote, typing]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const send = () => {
    if (!draft.trim()) return;
    if (/\b(stupid|idiot|hate)\b/i.test(draft)) { setBlockedNote(true); setDraft(""); return; }
    setBlockedNote(false); setDraft("");
  };

  const msgs = ROOM_SCRIPT.slice(0, shown);

  return (
    <div className="nuance-phone">
      <div className="np-notch" />
      <StatusBar />
      <div className="np-body" style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: "6px 14px 10px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 4px 12px", position: "relative" }}>
          <button onClick={() => router.push(`/summary/live?mode=${mode}`)} style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 13.5 }}>VoyageuseSereine</span>
              <LiveDot size={6} />
            </div>
            <p className="np-eyebrow" style={{ fontSize: 8, marginTop: 3 }}>{m.name} · {MODE_DETAIL[mode].structure}</p>
          </div>
          <button onClick={() => setMenu(!menu)} style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
          </button>
          {menu && (
            <div style={{ position: "absolute", top: 44, right: 0, zIndex: 20, width: 180, borderRadius: 16, border: "1px solid var(--line)", background: "rgba(14,14,16,0.97)", backdropFilter: "blur(18px)", padding: 6, boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>
              {[["Report this person", "var(--danger)"], ["Block & leave", "var(--danger)"], ["Mute notifications", "var(--text)"]].map(([t, c]) => (
                <button key={t} onClick={() => setMenu(false)} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 12px", borderRadius: 11, border: "none", background: "transparent", color: c, cursor: "pointer", font: "inherit", fontSize: 12.5 }}>{t}</button>
              ))}
            </div>
          )}
        </div>

        {/* Blitz clocks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {[{ key: "them", label: "VoyageuseSereine", val: themLeft }, { key: "you", label: "You", val: youLeft }].map(c => {
            const on = active === c.key;
            const low = c.val <= 30;
            return (
              <div key={c.key} style={{ padding: "8px 11px", borderRadius: 12, border: "1px solid " + (on ? "var(--accent)" : "var(--line-soft)"), background: on ? "var(--panel-2)" : "var(--panel)", opacity: on ? 1 : 0.65, transition: "border-color 220ms ease, background 220ms ease, opacity 220ms ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                    {on && <LiveDot size={5} />}
                    <span className="np-eyebrow" style={{ fontSize: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                  </span>
                  <span style={{ flex: "0 0 auto", minWidth: 34, textAlign: "right", fontFamily: "var(--font-caps)", fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em", color: low ? "var(--danger)" : "var(--text)" }}>{fmt(c.val)}</span>
                </div>
                <div style={{ height: 3, borderRadius: 999, background: "var(--line)", overflow: "hidden", marginTop: 7 }}>
                  <div style={{ height: "100%", width: (c.val / PER * 100) + "%", background: low ? "var(--danger)" : "var(--accent)", transition: "width 1s linear" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Transcript */}
        <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, padding: "8px 2px" }}>
          {/* Topic header */}
          <div style={{ textAlign: "center", padding: "4px 0 10px" }}>
            <p className="np-eyebrow" style={{ fontSize: 8.5 }}>Topic</p>
            <p style={{ margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: 16, fontStyle: "italic", lineHeight: 1.2 }}>"{TOPICS[mode][0]}"</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "6px 12px", borderRadius: 999, border: "1px solid var(--line-soft)", background: "var(--panel)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h7M9 5v3c0 3.5-2 6-5 7" /><path d="M7 11c1 2 3 3.5 5 4" /><path d="m13 19 4-9 4 9M14.5 16h5" /></svg>
              <span className="np-eyebrow" style={{ fontSize: 8 }}>Auto-translated · they speak French</span>
            </div>
          </div>

          {/* Messages */}
          {msgs.map((msg, i) => {
            if (msg.who === "system") {
              return (
                <div key={i} style={{ alignSelf: "center", maxWidth: "82%", textAlign: "center", padding: "9px 14px", borderRadius: 14, border: "1px dashed var(--line)", background: "var(--panel)" }}>
                  <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "var(--faint)" }}>{msg.text}</p>
                </div>
              );
            }
            const mine = msg.who === "you";
            return (
              <div key={i} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "84%" }}>
                {msg.turn && <p className="np-eyebrow" style={{ fontSize: 7.5, marginBottom: 6, textAlign: mine ? "right" : "left" }}>{msg.turn}</p>}
                <div style={{ padding: "12px 15px", borderRadius: 18, borderTopRightRadius: mine ? 6 : 18, borderTopLeftRadius: mine ? 18 : 6, fontSize: 13, lineHeight: 1.45, background: mine ? "var(--accent)" : "var(--panel)", color: mine ? "var(--on-accent)" : "var(--text)", border: mine ? "none" : "1px solid var(--line-soft)" }}>
                  {msg.text}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, margin: "5px 4px 0", justifyContent: mine ? "flex-end" : "flex-start" }}>
                  {"from" in msg && msg.from && !mine && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--faint)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h7M9 5v3c0 3.5-2 6-5 7" /><path d="M7 11c1 2 3 3.5 5 4" /><path d="m13 19 4-9 4 9M14.5 16h5" /></svg>
                      Translated · {msg.from}
                    </span>
                  )}
                  <span style={{ fontSize: 10, color: "var(--faint)" }}>{"t" in msg ? msg.t : ""}</span>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing && (
            <div style={{ alignSelf: "flex-start", maxWidth: "84%" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "12px 15px", borderRadius: 18, borderTopLeftRadius: 6, background: "var(--panel)", border: "1px solid var(--line-soft)" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "var(--muted)", animation: `npType 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
                <span style={{ marginLeft: 4, fontSize: 10, color: "var(--faint)", fontFamily: "var(--font-caps)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {voice ? "Speaking · French" : "Typing · French"}
                </span>
              </div>
            </div>
          )}

          {/* Moderation blocked note */}
          {blockedNote && (
            <div style={{ alignSelf: "flex-end", maxWidth: "84%", padding: "9px 14px", borderRadius: 14, border: "1px solid var(--danger)", background: "rgba(224,121,111,0.08)" }}>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "var(--danger)" }}>Held by moderation — this message wasn't delivered.</p>
            </div>
          )}
        </div>

        {/* Composer */}
        <div style={{ paddingTop: 8, borderTop: "1px solid var(--line-soft)", marginTop: 4 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setVoice(v => !v)} style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, border: "1px solid var(--line)", background: voice ? "var(--accent)" : "var(--panel)", color: voice ? "var(--on-accent)" : "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8" /></svg>
            </button>
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={voice ? "Voice is live — or type…" : "Say something honest…"} style={{ flex: 1, padding: "11px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", fontSize: 13, outline: "none" }} />
            <button onClick={send} disabled={!draft.trim()} style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, background: draft.trim() ? "var(--accent)" : "var(--panel)", border: "1px solid var(--line)", color: draft.trim() ? "var(--on-accent)" : "var(--faint)", cursor: draft.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
          <p style={{ textAlign: "center", marginTop: 8, fontFamily: "var(--font-caps)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)" }}>Every message is moderated · report & block always available</p>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";
export default function RoomPage({ params }: { params: Promise<{ id: string }> }) { return <Suspense fallback={<div className="nuance-phone" />}><RoomPageInner params={params} /></Suspense>; }
