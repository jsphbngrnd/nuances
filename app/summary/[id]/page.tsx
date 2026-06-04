"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MODES } from "@/lib/nuance-data";
import { StatusBar, Screen, ArrowIcon } from "@/components/ui";
import { useCopy, useLocale } from "@/lib/use-copy";
import { createClient } from "@/lib/supabase/client";

type Rec = { kind: string; title: string; source: string; reason?: string };
type Summary = {
  summary: string;
  agreement: string[];
  disagreement: string[];
  tags: string[];
  tone: string;
  followup: string;
  recommendations: Rec[];
};

function SummaryPageInner() {
  const t = useCopy();
  const locale = useLocale();
  const router = useRouter();
  const search = useSearchParams();
  const mode = search.get("mode") || "deep";
  const m = MODES.find(x => x.id === mode)!;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<Summary | null>(null);
  const [roomMeta, setRoomMeta] = useState<{ topic: string; partnerAlias: string; duration: string; roomId?: string }>({
    topic: "—", partnerAlias: "VoyageuseSereine", duration: "5:00",
  });
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("nuance-room");
    if (!raw) {
      setError(t.summary.noData);
      setLoading(false);
      return;
    }

    let roomData: { mode: string; topic: string; partnerAlias: string; roomId?: string; messages: { who: string; text: string }[] };
    try {
      roomData = JSON.parse(raw);
    } catch {
      setError("Conversation data corrupted.");
      setLoading(false);
      return;
    }

    setRoomMeta({ topic: roomData.topic, partnerAlias: roomData.partnerAlias, duration: "5:00", roomId: roomData.roomId });

    if (!roomData.messages || roomData.messages.length === 0) {
      setError(t.summary.tooShort);
      setLoading(false);
      return;
    }

    fetch("/api/generate-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: roomData.mode,
        topic: roomData.topic,
        partnerAlias: roomData.partnerAlias,
        locale,
        messages: roomData.messages,
      }),
    })
      .then(r => r.json())
      .then(result => {
        if (result.error) {
          setError(result.error.includes("quota")
            ? "OpenAI quota exceeded — add credits at platform.openai.com/settings/billing"
            : result.error);
        } else {
          setData(result as Summary);
        }
      })
      .catch(() => setError("Failed to generate summary. Check your connection."))
      .finally(() => setLoading(false));
  }, []);

  const panel = (children: React.ReactNode) => (
    <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 10 }}>
      {children}
    </div>
  );

  return (
    <div className="nuance-phone">


      <Screen>
        {/* TopBar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0 14px" }}>
          <button onClick={() => router.push("/home")} style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div style={{ flex: 1 }}><p className="np-eyebrow" style={{ fontSize: 9 }}>{t.summary.eyebrow}</p></div>
          <span className="np-chip" style={{ padding: "5px 11px" }}>{m.name}</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, marginBottom: 14 }}>☾</div>
          <h1 className="np-display" style={{ fontSize: 30 }}>{t.summary.title}</h1>
          <p style={{ margin: "10px auto 0", fontSize: 12, color: "var(--muted)", maxWidth: "30ch" }}>
            {roomMeta.duration} {t.summary.with(roomMeta.partnerAlias, roomMeta.topic)}
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, border: "2px solid transparent", borderTopColor: "var(--accent)", animation: "npSpin 0.9s linear infinite", margin: "0 auto 16px" }} />
            <p className="np-eyebrow" style={{ fontSize: 9 }}>{t.summary.loading}</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--danger)", background: "rgba(224,121,111,0.08)", marginBottom: 14 }}>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--danger)", lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        {/* Summary content */}
        {!loading && data && (
          <>
            {/* What happened */}
            {panel(
              <>
                <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>{t.summary.whatHappened}</p>
                <p style={{ margin: "0 0 12px", fontSize: 12.5, lineHeight: 1.55 }}>{data.summary}</p>
                <div className="np-hairline" />
                <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
                  <div><p className="np-eyebrow" style={{ fontSize: 8 }}>{t.summary.tone}</p><p style={{ margin: "4px 0 0", fontSize: 12 }}>{data.tone}</p></div>
                </div>
              </>
            )}

            {/* Agreement */}
            {data.agreement?.length > 0 && panel(
              <>
                <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 12 }}>{t.summary.whereMet}</p>
                {data.agreement.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto", marginTop: 1 }}><path d="M20 6L9 17l-5-5" /></svg>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.4 }}>{a}</p>
                  </div>
                ))}
              </>
            )}

            {/* Disagreement */}
            {data.disagreement?.length > 0 && panel(
              <>
                <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 12 }}>{t.summary.whereDiffered}</p>
                {data.disagreement.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < data.disagreement.length - 1 ? 10 : 0 }}>
                    <span style={{ flex: "0 0 auto", fontFamily: "var(--font-display)", fontSize: 16, lineHeight: 1, marginTop: -2, color: "var(--muted)" }}>↔</span>
                    <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.4 }}>{d}</p>
                  </div>
                ))}
              </>
            )}

            {/* Themes */}
            {data.tags?.length > 0 && panel(
              <>
                <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 12 }}>{t.summary.themes}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {data.tags.map(tag => (
                    <span key={tag} className="np-chip" style={{ textTransform: "none", letterSpacing: "0.02em", fontFamily: "var(--font-sans)", fontSize: 12, padding: "7px 12px" }}>{tag}</span>
                  ))}
                </div>
              </>
            )}

            {/* Follow-up */}
            {data.followup && (
              <div style={{ padding: "20px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "linear-gradient(180deg, var(--panel-2), var(--panel))", marginBottom: 10 }}>
                <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>{t.summary.questionEyebrow}</p>
                <p className="np-display" style={{ fontSize: 21, fontStyle: "italic", lineHeight: 1.15 }}>{data.followup}</p>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations?.length > 0 && panel(
              <>
                <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 14 }}>{t.summary.recsEyebrow}</p>
                {data.recommendations.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderTop: i ? "1px solid var(--line-soft)" : "none" }}>
                    <div style={{ flex: 1 }}>
                      <p className="np-eyebrow" style={{ fontSize: 8 }}>{r.kind}</p>
                      <p style={{ margin: "4px 0 2px", fontSize: 13 }}>{r.title}</p>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "var(--muted)" }}>{r.source}</p>
                      {r.reason && <p style={{ margin: 0, fontSize: 11, lineHeight: 1.4, color: "var(--faint)" }}>{r.reason}</p>}
                    </div>
                    <ArrowIcon />
                  </div>
                ))}
              </>
            )}

            {/* Reconnect vote */}
            <div style={{ padding: "18px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)", marginBottom: 14 }}>
              <p className="np-eyebrow" style={{ fontSize: 9, marginBottom: 10 }}>{t.summary.reconnect}</p>
              {vote === null ? (
                <>
                  <p style={{ margin: "0 0 16px", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>{t.summary.reconnectSub}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button className="np-btn np-btn-ghost" style={{ width: "100%" }} onClick={() => setVote("no")}>{t.summary.notNow}</button>
                    <button className="np-btn" style={{ width: "100%" }} onClick={async () => {
                      setVote("yes");
                      // Write vote to Supabase so partner gets notified
                      try {
                        const supabase = createClient();
                        const { data: { user } } = await supabase.auth.getUser();
                        if (!user || !roomMeta.roomId) return;
                        // Find partner via admin endpoint (bypasses RLS)
                        const partnerRes = await fetch(`/api/room-partner?roomId=${roomMeta.roomId}`);
                        const partnerData = await partnerRes.json();
                        const partnerId = partnerData?.partnerId;
                        if (!partnerId) return;
                        if (!partnerId) return;
                        // Check if reconnect record already exists
                        const { data: existing } = await supabase
                          .from("reconnects").select("id, user_a_id").eq("room_id", roomMeta.roomId).maybeSingle();
                        if (existing) {
                          const field = existing.user_a_id === user.id ? "user_a_vote" : "user_b_vote";
                          await supabase.from("reconnects").update({ [field]: true }).eq("id", existing.id);
                        } else {
                          await supabase.from("reconnects").insert({ room_id: roomMeta.roomId, user_a_id: user.id, user_b_id: partnerId, user_a_vote: true });
                        }
                      } catch (e) { console.error("reconnect vote error:", e); }
                    }}>{t.summary.yesReconnect}</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  {vote === "yes"
                    ? <><p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.5 }}>{t.summary.reconnectVoted(roomMeta.partnerAlias)}</p><button className="np-btn" onClick={() => router.push("/reconnects")}>{t.summary.seeReconnects} <ArrowIcon /></button></>
                    : <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{t.summary.noReconnect}</p>}
                </div>
              )}
            </div>
          </>
        )}

        <button className="np-btn" style={{ width: "100%" }} onClick={() => router.push("/start")}>
          {t.summary.talkAgain} <ArrowIcon />
        </button>
      </Screen>
    </div>
  );
}

import { Suspense } from "react";
export default function SummaryPage() {
  return <Suspense fallback={<div className="nuance-phone" />}><SummaryPageInner /></Suspense>;
}
