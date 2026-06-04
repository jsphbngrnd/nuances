"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen, MiniNav } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

type ReconnectInvite = {
  id: string;
  room_id: string;
  from_alias: string;
  topic: string;
  when: string;
};

export default function NotificationsPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<ReconnectInvite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      // Two separate queries (compound nested AND+OR not supported in PostgREST JS)
      const [{ data: d1 }, { data: d2 }] = await Promise.all([
        // They're user_a, voted yes — we're user_b, haven't voted
        supabase.from("reconnects")
          .select("id, room_id, user_a_id, user_b_id, user_a_vote, user_b_vote")
          .eq("user_b_id", user.id).eq("user_a_vote", true).is("user_b_vote", null),
        // We're user_a, they're user_b, voted yes — we haven't voted
        supabase.from("reconnects")
          .select("id, room_id, user_a_id, user_b_id, user_a_vote, user_b_vote")
          .eq("user_a_id", user.id).eq("user_b_vote", true).is("user_a_vote", null),
      ]);
      const data = [...(d1 ?? []), ...(d2 ?? [])];

      if (data && data.length > 0) {
        // Fetch sender aliases
        const enriched = await Promise.all(data.map(async (r) => {
          const senderId = r.user_b_id === user.id ? r.user_a_id : r.user_b_id;
          const { data: sender } = await supabase
            .from("users").select("alias").eq("id", senderId).single();
          return {
            id: r.id,
            room_id: r.room_id,
            from_alias: sender?.alias ?? "Someone",
            topic: "a conversation",
            when: "Recently",
          };
        }));
        setInvites(enriched);
      }
      setLoading(false);
    });
  }, []);

  async function acceptReconnect(invite: ReconnectInvite) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Vote yes
    const { data: rec } = await supabase.from("reconnects").select("user_a_id, user_b_id").eq("id", invite.id).single();
    if (!rec) return;

    const field = rec.user_a_id === user.id ? "user_a_vote" : "user_b_vote";
    await supabase.from("reconnects").update({ [field]: true, matched_at: new Date().toISOString() }).eq("id", invite.id);

    router.push("/reconnects");
  }

  async function declineReconnect(id: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: rec } = await supabase.from("reconnects").select("user_a_id, user_b_id").eq("id", id).single();
    if (!rec) return;

    const field = rec.user_a_id === user.id ? "user_a_vote" : "user_b_vote";
    await supabase.from("reconnects").update({ [field]: false }).eq("id", id);
    setInvites(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="nuance-phone">
      <Screen>
        <div style={{ paddingBottom: 18 }}>
          <p className="np-eyebrow">Notifications</p>
          <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>What's waiting.</h1>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, border: "2px solid transparent", borderTopColor: "var(--accent)", animation: "npSpin 0.9s linear infinite", margin: "0 auto" }} />
          </div>
        )}

        {!loading && invites.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--faint)", fontStyle: "italic" }}>Nothing yet.</p>
            <p style={{ margin: "10px auto 0", fontSize: 12.5, color: "var(--muted)", maxWidth: "24ch", lineHeight: 1.5 }}>Reconnect invites from your conversations will show up here.</p>
          </div>
        )}

        {!loading && invites.length > 0 && (
          <div style={{ display: "grid", gap: 12 }}>
            {invites.map(invite => (
              <div key={invite.id} style={{ padding: "16px 18px", borderRadius: 22, border: "1px solid var(--line-soft)", background: "var(--panel)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 16, flex: "0 0 auto" }}>
                    {invite.from_alias.charAt(0)}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13.5 }}>{invite.from_alias}</p>
                    <p className="np-eyebrow" style={{ fontSize: 8, marginTop: 3 }}>Wants to reconnect</p>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--faint)" }}>{invite.when}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button className="np-btn np-btn-ghost" style={{ width: "100%", fontSize: 11 }} onClick={() => declineReconnect(invite.id)}>
                    Not now
                  </button>
                  <button className="np-btn" style={{ width: "100%", fontSize: 11 }} onClick={() => acceptReconnect(invite)}>
                    Connect →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Screen>
      <MiniNav />
    </div>
  );
}
