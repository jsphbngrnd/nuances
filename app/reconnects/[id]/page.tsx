"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, MiniNav, LiveDot } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

type Msg = { id: string; who: "you" | "them"; text: string; createdAt: string };

export default function ReconnectChatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [reconnectId, setReconnectId] = useState<string | null>(null);
  const [partnerAlias, setPartnerAlias] = useState("…");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const recRef = useRef<any>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    params.then(p => setReconnectId(p.id));
  }, []);

  useEffect(() => {
    if (!reconnectId) return;
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      userIdRef.current = user.id;

      // Fetch reconnect + partner alias
      const { data: rec } = await supabase
        .from("reconnects")
        .select("user_a_id, user_b_id")
        .eq("id", reconnectId)
        .single();

      if (!rec) return;
      const partnerId = rec.user_a_id === user.id ? rec.user_b_id : rec.user_a_id;
      const { data: p } = await supabase.from("users").select("alias").eq("id", partnerId).single();
      setPartnerAlias(p?.alias ?? "Unknown");

      // Load message history from Supabase (using room_id linked to this reconnect)
      // For now use broadcast-only (no persistence needed for MVP)

      // Join broadcast channel for this reconnect thread
      const channel = supabase.channel(`reconnect-${reconnectId}`, {
        config: { broadcast: { self: false } },
      });

      channel.on("broadcast", { event: "message" }, (payload: any) => {
        setMessages(prev => [...prev, {
          id: String(Date.now()),
          who: "them",
          text: payload.payload.text,
          createdAt: new Date().toISOString(),
        }]);
      });

      channel.subscribe();
      channelRef.current = channel;
    });

    return () => {
      if (channelRef.current) {
        const supabase = createClient();
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [reconnectId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send() {
    const text = draft.trim();
    if (!text || !channelRef.current) return;
    setDraft("");
    recRef.current?.stop();
    setListening(false);

    channelRef.current.send({ type: "broadcast", event: "message", payload: { text } });
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      who: "you",
      text,
      createdAt: new Date().toISOString(),
    }]);
  }

  function toggleMic() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice requires Chrome or Edge."); return; }
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    const m = document.cookie.match(/nuance-locale=([^;]+)/);
    rec.lang = m?.[1] === "fr" ? "fr-FR" : "en-US";
    recRef.current = rec;
    rec.onresult = (e: any) => setDraft(Array.from(e.results as any[]).map((r: any) => r[0].transcript).join(""));
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  }

  return (
    <div className="nuance-phone">
      <div className="np-body" style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: "6px 14px 10px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "2px 4px 14px" }}>
          <button onClick={() => router.push("/reconnects")} style={{ width: 34, height: 34, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 14 }}>{partnerAlias}</span>
              <LiveDot size={6} />
            </div>
            <p className="np-eyebrow" style={{ fontSize: 7.5, marginTop: 3 }}>Reconnect · Free chat</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, padding: "4px 2px" }}>
          {messages.length === 0 && (
            <p style={{ textAlign: "center", fontSize: 12, color: "var(--faint)", fontStyle: "italic", marginTop: 24 }}>
              Start the conversation — no timer, no turns.
            </p>
          )}
          {messages.map(msg => {
            const mine = msg.who === "you";
            return (
              <div key={msg.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "84%" }}>
                <div style={{ padding: "11px 14px", borderRadius: 18, borderTopRightRadius: mine ? 5 : 18, borderTopLeftRadius: mine ? 18 : 5, fontSize: 13, lineHeight: 1.5, background: mine ? "var(--accent)" : "var(--panel)", color: mine ? "var(--on-accent)" : "var(--text)", border: mine ? "none" : "1px solid var(--line-soft)" }}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <div style={{ paddingTop: 8, borderTop: "1px solid var(--line-soft)", marginTop: 4 }}>
          {listening && draft && (
            <div style={{ marginBottom: 6, padding: "7px 12px", borderRadius: 12, border: "1px solid var(--accent)", background: "rgba(241,241,235,0.06)", fontSize: 12, color: "var(--text)" }}>
              <span style={{ marginRight: 6, fontFamily: "var(--font-caps)", fontSize: 7.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>Live</span>{draft}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={toggleMic} style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, border: `1px solid ${listening ? "var(--accent)" : "var(--line)"}`, background: listening ? "var(--accent)" : "var(--panel)", color: listening ? "var(--on-accent)" : "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {listening && <span style={{ position: "absolute", inset: -3, borderRadius: 999, border: "2px solid var(--accent)", opacity: 0.4, animation: "npPulse 1.4s ease-in-out infinite" }} />}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8" /></svg>
            </button>
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Say something…"
              style={{ flex: 1, padding: "11px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", color: "var(--text)", fontSize: 16, outline: "none" }}
            />
            <button onClick={send} disabled={!draft.trim()} style={{ flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, background: draft.trim() ? "var(--accent)" : "var(--panel)", border: "1px solid var(--line)", color: draft.trim() ? "var(--on-accent)" : "var(--faint)", cursor: draft.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" /></svg>
            </button>
          </div>
        </div>
      </div>
      <MiniNav />
    </div>
  );
}
