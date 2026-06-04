"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MODES, MODE_DETAIL, TOPICS, AI_PERSONAS } from "@/lib/nuance-data";
import { LiveDot } from "@/components/ui";
import { useCopy, useLocale } from "@/lib/use-copy";
import { createClient } from "@/lib/supabase/client";

const PER = 5 * 60;

type Msg = { id?: string; who: "you" | "them" | "system"; text: string; translated?: boolean };
type Turn = "you" | "them";
type RoomMode = "ai" | "real";

function getLocaleLang() {
  if (typeof document === "undefined") return "en-US";
  const m = document.cookie.match(/nuance-locale=([^;]+)/);
  return m?.[1] === "fr" ? "fr-FR" : "en-US";
}

function selectPersona(mode: string, personaId?: string | null) {
  if (personaId) {
    const found = AI_PERSONAS.find(p => p.id === personaId);
    if (found) return found;
  }
  const matches = AI_PERSONAS.filter(p => p.modes.includes(mode as any));
  const pool = matches.length > 0 ? matches : AI_PERSONAS;
  return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
}

function RoomPageInner({ params }: { params: Promise<{ id: string }> }) {
  const t = useCopy();
  const locale = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const mode = (search.get("mode") || "deep") as keyof typeof MODE_DETAIL;
  const matchType = (search.get("matchType") || "real") as RoomMode; // default real, not ai
  const roomId = search.get("roomId"); // set when matchType === "real"
  const m = MODES.find(x => x.id === mode)!;

  const topicPool = TOPICS[mode];
  // Real rooms: topic passed from topic page (same for both users)
  // AI rooms: random
  const topicRef = useRef(
    search.get("topic")
      ? decodeURIComponent(search.get("topic")!)
      : topicPool[Math.floor(Math.random() * topicPool.length)]
  );
  const topic = topicRef.current;

  const personaRef = useRef(selectPersona(mode, search.get("personaId")));
  const persona = personaRef.current;
  const [partnerName, setPartnerName] = useState(
    matchType === "real" ? "…" : (persona?.alias ?? "PatientEcho")
  );
  const partnerLang = matchType === "real" ? "English" : (persona?.language ?? "English");

  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [turn, setTurn] = useState<Turn>("them");
  const [youLeft, setYouLeft] = useState(PER);
  const [themLeft, setThemLeft] = useState(PER);
  const [listening, setListening] = useState(false);
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const openingFired = useRef(false);
  const channelRef = useRef<any>(null);

  const isAi = matchType === "ai";
  const sendDisabled = !draft.trim() || (isAi && aiTyping) || (isAi && turn !== "you");

  // ── Clock ─────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (isAi) {
        if (turn === "you") setYouLeft(v => Math.max(0, v - 1));
        else setThemLeft(v => Math.max(0, v - 1));
      } else {
        // In real rooms both clocks run — your clock while you're composing
        setYouLeft(v => Math.max(0, v - 1));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [turn, isAi]);

  // ── Auto-scroll ───────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, aiTyping]);

  // ── Real room: subscribe to Supabase Realtime ─────────────────
  useEffect(() => {
    if (!roomId || isAi) return;
    const supabase = createClient();

    // Fetch partner alias via admin endpoint (RLS blocks reading other users' profiles)
    fetch(`/api/room-partner?roomId=${roomId}`)
      .then(r => r.json())
      .then(d => { if (d.alias) setPartnerName(d.alias); })
      .catch(() => {});

    // Load existing messages first
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (msgs) {
        setMessages(msgs.map(m => ({
          id: m.id,
          who: m.user_id === user?.id ? "you" : "them",
          text: m.content,
        })));
        setTurn("you"); // after loading history, it's your turn
      }
    });

    // Subscribe to new messages
    const channel = supabase
      .channel(`room:${roomId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`,
      }, async (payload) => {
        const { data: { user } } = await supabase.auth.getUser();
        const msg = payload.new as any;
        if (msg.user_id !== user?.id) {
          setMessages(prev => [...prev, { id: msg.id, who: "them", text: msg.content }]);
          setThemLeft(v => Math.max(0, v - 1)); // partner used some of their time
        }
      })
      .subscribe();

    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [roomId, isAi]);

  // ── AI room: partner opens ────────────────────────────────────
  useEffect(() => {
    if (!isAi) return;
    if (openingFired.current) return;
    openingFired.current = true;
    let cancelled = false;
    setAiTyping(true);
    setTurn("them");

    fetch("/api/room-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode, topic, personaId: persona?.id, locale,
        messages: [],
        userMessage: `[Opening] Start the conversation: "${topic}". One or two sentences, genuine. No question yet.`,
      }),
    })
      .then(r => r.json())
      .then(d => new Promise<any>(res => setTimeout(() => res(d), 1500)))
      .then(d => {
        if (cancelled) return;
        if (d.reply?.startsWith("(OpenAI") || d.reply?.startsWith("(No OpenAI")) {
          setError(d.reply);
        } else {
          setMessages([{ who: "them", text: d.reply, translated: partnerLang !== (locale === "fr" ? "French" : "English") }]);
        }
        setAiTyping(false);
        setTurn("you");
      })
      .catch(() => { if (!cancelled) { setAiTyping(false); setTurn("you"); } });

    return () => { cancelled = true; };
  }, [isAi]);

  // ── Send ──────────────────────────────────────────────────────
  async function send() {
    const text = draft.trim();
    if (!text) return;
    if (isAi && (aiTyping || turn !== "you")) return;

    if (/\b(stupid|idiot|hate)\b/i.test(text)) { setBlocked(true); setDraft(""); return; }
    setBlocked(false);
    setDraft("");
    stopListening();

    if (!isAi && roomId) {
      // Real room — write to Supabase, Realtime delivers to partner
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("messages").insert({
        room_id: roomId,
        user_id: user?.id,
        source_type: "text",
        content: text,
        moderation_status: "approved",
      });
      setMessages(prev => [...prev, { who: "you", text }]);
      return;
    }

    // AI room — call persona
    const userMsg: Msg = { who: "you", text };
    const next = [...messages, userMsg];
    setMessages(next);
    setTurn("them");
    setAiTyping(true);
    setError("");

    try {
      const res = await fetch("/api/room-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode, topic, personaId: persona?.id, locale,
          messages: next.filter(m => m.who !== "system").map(m => ({ who: m.who, text: m.text })),
          userMessage: text,
        }),
      });
      const [data] = await Promise.all([res.json(), new Promise(r => setTimeout(r, 1500))]);
      if (data.reply?.startsWith("(OpenAI") || data.reply?.startsWith("(No OpenAI")) {
        setError(data.reply);
        setTurn("you");
      } else {
        setMessages(prev => [...prev, {
          who: "them", text: data.reply,
          translated: partnerLang !== (locale === "fr" ? "French" : "English"),
        }]);
        setTurn("you");
      }
    } catch {
      setMessages(prev => [...prev, { who: "system", text: t.room.connectionDrop }]);
      setTurn("you");
    } finally {
      setAiTyping(false);
    }
  }

  // ── Voice ─────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice requires Chrome or Edge."); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = getLocaleLang();
    recRef.current = rec;
    rec.onresult = (e: any) => setDraft(Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(""));
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  }, []);

  const stopListening = useCallback(() => { recRef.current?.stop(); setListening(false); }, []);

  function toggleMic() {
    if (isAi && turn !== "you") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice requires Chrome or Edge."); return; }
    if (!listening) startListening(); else stopListening();
  }

  function endConversation() {
    // Mark room as ended in Supabase (real rooms only)
    if (!isAi && roomId) {
      const supabase = createClient();
      supabase.from("rooms").update({ status: "ended", ended_at: new Date().toISOString() }).eq("id", roomId).then(() => {});
    }
    fetch("/api/matchmaking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "leave" }) });
    sessionStorage.setItem("nuance-room", JSON.stringify({
      mode, topic, partnerAlias: partnerName,
      messages: messages.filter(m => m.who !== "system").map(m => ({ who: m.who, text: m.text })),
    }));
    router.push(`/summary/live?mode=${mode}`);
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="nuance-phone">
      <div className="np-body" style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: "6px 14px 10px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 4px 12px", position: "relative" }}>
          <button onClick={endConversation} style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 13.5 }}>{partnerName}</span>
              {(partnerOnline || !isAi) && <LiveDot size={6} />}
              {!isAi && <span className="np-eyebrow" style={{ fontSize: 7.5, color: "var(--positive)" }}>Live</span>}
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
          {[{ key: "them" as Turn, label: partnerName, val: themLeft }, { key: "you" as Turn, label: t.room.youLabel, val: youLeft }].map(c => {
            const active = isAi ? turn === c.key : c.key === "you";
            const low = c.val <= 30;
            return (
              <div key={c.key} style={{ padding: "8px 11px", borderRadius: 12, border: `1px solid ${active ? "var(--accent)" : "var(--line-soft)"}`, background: active ? "var(--panel-2)" : "var(--panel)", opacity: active ? 1 : 0.55, transition: "all 300ms ease" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
                    {active && <LiveDot size={5} />}
                    <span className="np-eyebrow" style={{ fontSize: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                  </span>
                  <span style={{ fontFamily: "var(--font-caps)", fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: low ? "var(--danger)" : "var(--text)" }}>{fmt(c.val)}</span>
                </div>
                <div style={{ height: 3, borderRadius: 999, background: "var(--line)", overflow: "hidden", marginTop: 7 }}>
                  <div style={{ height: "100%", width: `${c.val / PER * 100}%`, background: low ? "var(--danger)" : "var(--accent)", transition: "width 1s linear" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Transcript */}
        <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, padding: "8px 2px" }}>
          <div style={{ textAlign: "center", paddingBottom: 8 }}>
            <p className="np-eyebrow" style={{ fontSize: 8.5 }}>Topic</p>
            <p style={{ margin: "8px 0 0", fontFamily: "var(--font-display)", fontSize: 16, fontStyle: "italic", lineHeight: 1.2 }}>"{topic}"</p>
            {!isAi && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, padding: "5px 11px", borderRadius: 999, border: "1px solid var(--positive)", background: "rgba(126,224,184,0.08)" }}>
                <LiveDot size={6} />
                <span className="np-eyebrow" style={{ fontSize: 7.5, color: "var(--positive)" }}>Live conversation</span>
              </div>
            )}
          </div>

          {messages.length === 0 && !aiTyping && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--faint)", fontStyle: "italic", marginTop: 20 }}>
              {isAi ? "Starting the conversation…" : "Waiting for your partner to say something…"}
            </p>
          )}

          {messages.map((msg, i) => {
            if (msg.who === "system") return (
              <div key={i} style={{ alignSelf: "center", maxWidth: "82%", textAlign: "center", padding: "9px 14px", borderRadius: 14, border: "1px dashed var(--line)", background: "var(--panel)" }}>
                <p style={{ margin: 0, fontSize: 11, color: "var(--faint)" }}>{msg.text}</p>
              </div>
            );
            const mine = msg.who === "you";
            return (
              <div key={msg.id || i} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "84%" }}>
                <div style={{ padding: "12px 15px", borderRadius: 18, borderTopRightRadius: mine ? 5 : 18, borderTopLeftRadius: mine ? 18 : 5, fontSize: 13, lineHeight: 1.5, background: mine ? "var(--accent)" : "var(--panel)", color: mine ? "var(--on-accent)" : "var(--text)", border: mine ? "none" : "1px solid var(--line-soft)" }}>
                  {msg.text}
                </div>
                {msg.translated && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "4px 4px 0" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h7M9 5v3c0 3.5-2 6-5 7" /><path d="M7 11c1 2 3 3.5 5 4" /><path d="m13 19 4-9 4 9M14.5 16h5" /></svg>
                    <span style={{ fontSize: 10, color: "var(--faint)" }}>{t.room.translated(partnerLang)}</span>
                  </div>
                )}
              </div>
            );
          })}

          {isAi && aiTyping && (
            <div style={{ alignSelf: "flex-start" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "12px 15px", borderRadius: 18, borderTopLeftRadius: 5, background: "var(--panel)", border: "1px solid var(--line-soft)" }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "var(--muted)", animation: `npType 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                <span style={{ marginLeft: 4, fontSize: 10, color: "var(--faint)", fontFamily: "var(--font-caps)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {t.room.typingLabel(partnerLang)}
                </span>
              </div>
            </div>
          )}

          {blocked && <div style={{ alignSelf: "flex-end", maxWidth: "84%", padding: "9px 14px", borderRadius: 14, border: "1px solid var(--danger)", background: "rgba(224,121,111,0.08)" }}><p style={{ margin: 0, fontSize: 11, color: "var(--danger)" }}>{t.room.heldMessage}</p></div>}
          {error && <div style={{ alignSelf: "center", maxWidth: "90%", textAlign: "center", padding: "9px 14px", borderRadius: 14, border: "1px solid var(--danger)", background: "rgba(224,121,111,0.08)" }}><p style={{ margin: 0, fontSize: 11, color: "var(--danger)", lineHeight: 1.5 }}>{error}</p></div>}
        </div>

        {/* Composer */}
        <div style={{ paddingTop: 8, borderTop: "1px solid var(--line-soft)", marginTop: 4 }}>
          <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {isAi ? (
              <span className="np-eyebrow" style={{ fontSize: 7.5, color: turn === "you" ? "var(--positive)" : "var(--faint)" }}>
                {turn === "you" ? "▶ Your turn" : `▶ ${partnerName} is replying…`}
              </span>
            ) : (
              <span className="np-eyebrow" style={{ fontSize: 7.5, color: "var(--positive)" }}>▶ Type or speak</span>
            )}
            <button onClick={endConversation} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-caps)", fontSize: 7.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--danger)", padding: 0 }}>
              End conversation
            </button>
          </div>

          {listening && draft && (
            <div style={{ marginBottom: 6, padding: "8px 12px", borderRadius: 12, border: "1px solid var(--accent)", background: "rgba(241,241,235,0.06)", fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>
              <span style={{ marginRight: 6, fontFamily: "var(--font-caps)", fontSize: 7.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>Live</span>
              {draft}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={toggleMic} disabled={isAi && turn !== "you"} style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, border: `1px solid ${listening ? "var(--accent)" : "var(--line)"}`, background: listening ? "var(--accent)" : "var(--panel)", color: listening ? "var(--on-accent)" : "var(--text)", cursor: (isAi && turn !== "you") ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {listening && <span style={{ position: "absolute", inset: -3, borderRadius: 999, border: "2px solid var(--accent)", opacity: 0.4, animation: "npPulse 1.4s ease-in-out infinite" }} />}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8" /></svg>
            </button>
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              disabled={isAi && (aiTyping || turn !== "you")}
              placeholder={isAi && turn !== "you" ? `${partnerName} is replying…` : listening ? t.room.voicePlaceholder : t.room.placeholder}
              style={{ flex: 1, padding: "11px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", color: "var(--text)", fontSize: 16, outline: "none", opacity: (isAi && (aiTyping || turn !== "you")) ? 0.5 : 1 }}
            />
            <button onClick={send} disabled={sendDisabled} style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, background: !sendDisabled ? "var(--accent)" : "var(--panel)", border: "1px solid var(--line)", color: !sendDisabled ? "var(--on-accent)" : "var(--faint)", cursor: !sendDisabled ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
