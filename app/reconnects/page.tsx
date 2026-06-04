"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { RECONNECTS } from "@/lib/nuance-data";
import { StatusBar, Screen, MiniNav } from "@/components/ui";

const STATUS_COLOR: Record<string, string> = {
  Mutual: "var(--positive)",
  Pending: "var(--text)",
  Expired: "var(--faint)",
};

export default function ReconnectsPage() {
  const router = useRouter();

  return (
    <div className="nuance-phone">


      <Screen>
        <div style={{ paddingBottom: 18 }}>
          <p className="np-eyebrow">Reconnects</p>
          <h1 className="np-display" style={{ fontSize: 30, marginTop: 12 }}>Private and mutual.</h1>
          <p style={{ margin: "10px 0 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)" }}>
            No open DMs. If both people say yes, a reconnect thread opens here.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {RECONNECTS.map(r => {
            const isMutual = r.status === "Mutual";
            const isExpired = r.status === "Expired";
            return (
              <button
                key={r.name}
                onClick={() => isMutual ? router.push(`/room/${r.name.toLowerCase()}?mode=${r.mode.toLowerCase().replace(" ", "-")}`) : undefined}
                disabled={!isMutual}
                style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 20, border: "1px solid var(--line-soft)", background: "var(--panel)", cursor: isMutual ? "pointer" : "default", opacity: isExpired ? 0.5 : 1, font: "inherit", color: "var(--text)" }}
              >
                <div style={{ position: "relative", flex: "0 0 auto" }}>
                  <span style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel-2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 16 }}>
                    {r.name.charAt(0)}
                  </span>
                  {r.unread > 0 && (
                    <span style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: 999, background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-caps)", fontSize: 8, fontWeight: 700 }}>{r.unread}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name} · {r.mode}</p>
                    <span className="np-eyebrow" style={{ fontSize: 8, flex: "0 0 auto", marginLeft: 8, color: STATUS_COLOR[r.status] }}>{r.status}</span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.topic}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 10, color: "var(--faint)" }}>{r.when}</p>
                </div>
                {isMutual && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                )}
              </button>
            );
          })}
        </div>

        <p style={{ margin: "20px 0 0", fontSize: 11, lineHeight: 1.5, color: "var(--faint)", padding: "12px 14px", borderRadius: 14, border: "1px dashed var(--line-soft)" }}>
          Reconnects expire after 30 days of silence. Mutual threads are private — only the two of you can see them.
        </p>
      </Screen>
      <MiniNav />
    </div>
  );
}
