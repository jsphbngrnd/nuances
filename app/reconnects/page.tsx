"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, MiniNav } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

type Reconnect = { id: string; partner_alias: string; matched_at: string; unread: number };

export default function ReconnectsPage() {
  const router = useRouter();
  const [reconnects, setReconnects] = useState<Reconnect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("reconnects")
        .select("id, user_a_id, user_b_id, matched_at")
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq("user_a_vote", true).eq("user_b_vote", true)
        .order("matched_at", { ascending: false });

      if (data?.length) {
        const enriched = await Promise.all(data.map(async r => {
          const pid = r.user_a_id === user.id ? r.user_b_id : r.user_a_id;
          const { data: p } = await supabase.from("users").select("alias").eq("id", pid).single();
          return { id: r.id, partner_alias: p?.alias ?? "Unknown", matched_at: r.matched_at ?? "", unread: 0 };
        }));
        setReconnects(enriched);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="nuance-phone">
      <Screen>
        <div style={{ paddingBottom: 18 }}>
          <p className="np-eyebrow">Reconnects</p>
          <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>Private and mutual.</h1>
          <p style={{ margin: "10px 0 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>
            Only people you both agreed to talk to again.
          </p>
        </div>

        {loading && <div style={{ textAlign: "center", padding: 40 }}><div style={{ width: 32, height: 32, borderRadius: 999, border: "2px solid transparent", borderTopColor: "var(--accent)", animation: "npSpin 0.9s linear infinite", margin: "0 auto" }} /></div>}

        {!loading && reconnects.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--faint)", fontStyle: "italic" }}>Nothing here yet.</p>
            <p style={{ margin: "10px auto 0", fontSize: 12.5, color: "var(--muted)", maxWidth: "26ch", lineHeight: 1.5 }}>
              When both of you vote to reconnect after a conversation, they'll appear here.
            </p>
          </div>
        )}

        {!loading && reconnects.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {reconnects.map(r => (
              <button key={r.id} onClick={() => router.push(`/reconnects/${r.id}` as any)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 20, border: "1px solid var(--line-soft)", background: "var(--panel)", cursor: "pointer", font: "inherit", color: "var(--text)" }}>
                <span style={{ width: 38, height: 38, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 17, flex: "0 0 auto" }}>
                  {r.partner_alias.charAt(0)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5 }}>{r.partner_alias}</p>
                  <p className="np-eyebrow" style={{ fontSize: 7.5, marginTop: 4, color: "var(--positive)" }}>Mutual · tap to chat</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            ))}
          </div>
        )}

        <p style={{ marginTop: 20, fontSize: 11, lineHeight: 1.5, color: "var(--faint)", padding: "12px 14px", borderRadius: 14, border: "1px dashed var(--line-soft)" }}>
          Reconnect invites appear in Notifications. Both must say yes before the thread opens.
        </p>
      </Screen>
      <MiniNav />
    </div>
  );
}
