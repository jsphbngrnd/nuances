"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MODES, MODE_DETAIL, TOPICS, AI_PERSONAS } from "@/lib/nuance-data";
import { StatusBar, LiveDot } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";

const PER = 5 * 60;

type Message = {
  who: "you" | "them" | "system";
  text: string;
  turn?: string;
  translated?: boolean;
};

// Pick a persona for this room based on mode
function selectPersona(mode: string, personaId?: string | null) {
  if (personaId) {
    const found = AI_PERSONAS.find(p => p.id === personaId);
    if (found) return found;
  }
  const matches = AI_PERSONAS.filter(p => p.modes.includes(mode as any));
  const pool = matches.length > 0 ? matches : AI_PERSONAS;
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function RoomPageInner({ params }: { params: Promise<{ id: string }> }) {
  const t = useCopy();
  const router = useRouter();
  const search = useSearchParams();
  const mode = (search.get("mode") || "deep") as keyof typeof MODE_DETAIL;
  const personaId = search.get("personaId");
  const m = MODES.find(x => x.id === mode)!;
  const topic = TOPICS[mode][0];
  const persona = selectPersona(mode, personaId);
  const partnerName = persona?.alias ?? "VoyageuseSereine";
  const partnerLang = persona?.language ?? "French";

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [voice, setVoice] = useState(false);
  const [menu, setMenu] = useState(false);
  const [typing, setTyping] = useState(false);
  const [youLeft, setYouLeft] = useState(PER);
  const [themLeft, setThemLeft] = useState(PER);
  const [active, setActive] = useState<"you" | "them">("them");
  const [blocked, setBlocked] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Opening message
  useEffect(() => {
    let cancelled = false;
    setTyping(true);
    fetch("/api/room-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode, topic,
        personaId: persona?.id,
        messages: [],
        userMessage: t.room.openingPrompt(topic),
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setTyping(false);
        setMessages([{ who: "them", text: data.reply, turn: "Opening", translated: partnerLang !== "English" }]);
        setActive("you");
      })
      .catch(() => { if (!cancelled) setTyping(false); });
    return () => { cancelled = true; };
  }, []);

  // Blitz clock
  useEffect(() => {
    const t = setInterval(() => {
      if (active === "you") setYouLeft(v => Math.max(0, v - 1));
      else setThemLeft(v => Math.max(0, v - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [active]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, blocked]);

  // Voice recognition setup
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Use Chrome or Edge.");
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    recognitionRef.current = rec;

    rec.onresult = (event: any) => {
      const transcript = Array.from(event.results as any[])
        .map((r: any) => r[0].transcript)
        .join("");
      setDraft(transcript);
    };

    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  function toggleVoice() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!voice) {
      if (!SpeechRecognition) { alert("Voice input requires Chrome or Edge."); return; }
      setVoice(true);
      startListening();
    } else {
      setVoice(false);
      stopListening();
    }
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  async function send(textOverride?: string) {
    const text = (textOverride ?? draft).trim();
    if (!text || typing) return;

    if (/\b(stupid|idiot|hate)\b/i.test(text)) {
      setBlocked(true);
      setDraft("");
      return;
    }
    setBlocked(false);
    setDraft("");
    if (voice) stopListening();

    const userMsg: Message = { who: "you", text };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setActive("them");
    setTyping(true);

    try {
      const res = await fetch("/api/room-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode, topic,
          personaId: persona?.id,
          messages: nextMsgs.filter(m => m.who !== "system").map(m => ({ who: m.who, text: m.text })),
          userMessage: text,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { who: "them", text: data.reply, translated: partnerLang !== "English" }]);
    } catch {
      setMessages(prev => [...prev, { who: "system", text: t.room.connectionDrop }]);
    } finally {
      setTyping(false);
      setActive("you");
      if (voice) startListening();
    }
  }

  return (
    <div className="nuance-phone">


      <div className="np-body" style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: "6px 14px 10px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 4px 12px", position: "relative" }}>
          <button onClick={() => {
            sessionStorage.setItem("nuance-room", JSON.stringify({
              mode, topic, partnerAlias: partnerName,
              messages: messages.filter(m => m.who !== "system").map(m => ({ who: m.who, text: m.text })),
            }));
            router.push(`/summary/live?mode=${mode}`);
          }} style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 13.5 }}>{partnerName}</span>
              <LiveDot size={6} />
            </div>
            <p className="np-eyebrow" style={{ fontSize: 8, marginTop: 3 }}>{m.name} · {MODE_DETAIL[mode].structure}</p>
          </div>
          <button onClick={() => setMenu(!menu)} style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
          </button>
          {menu && (
            <div style={{ position: "absolute", top: 44, right: 0, zIndex: 20, width: 180, borderRadius: 16, border: "1px solid var(--line)", background: "rgba(14,14,16,0.97)", backdropFilter: "blur(18px)", padding: 6, boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>
              {[[t.room.report, "var(--danger)"], [t.room.block, "var(--danger)"], [t.room.mute, "var(--text)"]].map(([label, c]) => (
                <button key={label} onClick={() => setMenu(false)} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 12px", borderRadius: 11, border: "none", background: "transparent", color: c, cursor: "pointer", font: "inherit", fontSize: 12.5 }}>{label}</button>
              ))}
            </div>
          )}
        </div>

        {/* Blitz clocks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {([{ key: "them", label: partnerName, val: themLeft }, { key: "you", label: t.room.youLabel, val: youLeft }] as const).map(c => {
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
          <div style={{ textAlign: "center", padding: "4px 0 10px" }}>
            <p className="np-eyebrow" style={{ fontSize: 8.5 }}>Topic</p>
            <p style={{ margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: 16, fontStyle: "italic", lineHeight: 1.2 }}>"{topic}"</p>
            {partnerLang !== "English" && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "6px 12px", borderRadius: 999, border: "1px solid var(--line-soft)", background: "var(--panel)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h7M9 5v3c0 3.5-2 6-5 7" /><path d="M7 11c1 2 3 3.5 5 4" /><path d="m13 19 4-9 4 9M14.5 16h5" /></svg>
                <span className="np-eyebrow" style={{ fontSize: 8 }}>{t.room.translatedBanner(partnerName, partnerLang)}</span>
              </div>
            )}
          </div>

          {messages.map((msg, i) => {
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
                {msg.translated && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "5px 4px 0" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h7M9 5v3c0 3.5-2 6-5 7" /><path d="M7 11c1 2 3 3.5 5 4" /><path d="m13 19 4-9 4 9M14.5 16h5" /></svg>
                    <span style={{ fontSize: 10, color: "var(--faint)" }}>{t.room.translated(partnerLang)}</span>
                  </div>
                )}
              </div>
            );
          })}

          {typing && (
            <div style={{ alignSelf: "flex-start", maxWidth: "84%" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "12px 15px", borderRadius: 18, borderTopLeftRadius: 6, background: "var(--panel)", border: "1px solid var(--line-soft)" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "var(--muted)", animation: `npType 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
                <span style={{ marginLeft: 4, fontSize: 10, color: "var(--faint)", fontFamily: "var(--font-caps)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {t.room.typingLabel(partnerLang)}
                </span>
              </div>
            </div>
          )}

          {blocked && (
            <div style={{ alignSelf: "flex-end", maxWidth: "84%", padding: "9px 14px", borderRadius: 14, border: "1px solid var(--danger)", background: "rgba(224,121,111,0.08)" }}>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "var(--danger)" }}>{t.room.heldMessage}</p>
            </div>
          )}
        </div>

        {/* Composer */}
        <div style={{ paddingTop: 8, borderTop: "1px solid var(--line-soft)", marginTop: 4 }}>
          {/* Voice transcript preview */}
          {listening && draft && (
            <div style={{ marginBottom: 6, padding: "8px 12px", borderRadius: 12, border: "1px solid var(--accent)", background: "rgba(241,241,235,0.06)", fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>
              <span style={{ marginRight: 6, fontFamily: "var(--font-caps)", fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>Live</span>
              {draft}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Mic button */}
            <button
              onClick={toggleVoice}
              style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, border: "1px solid " + (listening ? "var(--accent)" : "var(--line)"), background: listening ? "var(--accent)" : "var(--panel)", color: listening ? "var(--on-accent)" : "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
            >
              {listening && (
                <span style={{ position: "absolute", inset: -3, borderRadius: 999, border: "2px solid var(--accent)", opacity: 0.4, animation: "npPulse 1.4s ease-in-out infinite" }} />
              )}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="11" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8" />
              </svg>
            </button>

            {/* Text input */}
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={listening ? t.room.voicePlaceholder : t.room.placeholder}
              style={{ flex: 1, padding: "11px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", fontSize: 16, outline: "none" }}
            />

            {/* Send */}
            <button
              onClick={() => send()}
              disabled={!draft.trim() || typing}
              style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, background: draft.trim() && !typing ? "var(--accent)" : "var(--panel)", border: "1px solid var(--line)", color: draft.trim() && !typing ? "var(--on-accent)" : "var(--faint)", cursor: draft.trim() && !typing ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
          <p style={{ textAlign: "center", marginTop: 8, fontFamily: "var(--font-caps)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--faint)" }}>
            {listening ? t.room.micLive : t.room.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";
export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  return <Suspense fallback={<div className="nuance-phone" />}><RoomPageInner params={params} /></Suspense>;
}
