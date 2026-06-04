"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useCopy } from "@/lib/use-copy";
import { createClient } from "@/lib/supabase/client";

/* ── LiveDot ── */
export function LiveDot({ size = 7 }: { size?: number }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size }}>
      <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "var(--positive)", opacity: 0.45, animation: "npPulse 2.2s ease-in-out infinite" }} />
      <span style={{ position: "relative", width: size, height: size, borderRadius: 999, background: "var(--positive)" }} />
    </span>
  );
}

/* ── ModeGlyph ── */
export function ModeGlyph({ glyph, size = 26 }: { glyph: string; size?: number }) {
  return <span style={{ fontFamily: "var(--font-display)", fontSize: size, lineHeight: 1 }}>{glyph}</span>;
}

/* ── ArrowIcon ── */
export function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ── BackIcon ── */
export function BackIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/* ── StatusBar — removed per user request ── */
export function StatusBar() {
  return null;
}

/* ── MiniNav ── */
function NavIcon({ kind }: { kind: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M4 10.5 12 4l8 6.5" /><path {...p} d="M6.5 10v9h11v-9" /></svg>;
  if (kind === "reconnects") return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M12 20.25s-6.75-4.13-6.75-9.6A4.15 4.15 0 0 1 9.45 6.5c1.14 0 2.16.45 2.55 1.29.39-.84 1.41-1.29 2.55-1.29a4.15 4.15 0 0 1 4.2 4.15c0 5.47-6.75 9.6-6.75 9.6Z" /></svg>;
  if (kind === "notifications") return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path {...p} d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
  if (kind === "account") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...p} cx="12" cy="8" r="3.5" /><path {...p} d="M4.5 20c0-3.31 3.36-6 7.5-6s7.5 2.69 7.5 6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M12 3.4 19 6.1v4.9c0 4.4-2.9 7.4-7 8.9-4.1-1.5-7-4.5-7-8.9V6.1L12 3.4Z" /></svg>;
}

const NAV_HREFS = [
  { id: "home", href: "/home" },
  { id: "reconnects", href: "/reconnects" },
  { id: "notifications", href: "/notifications" },
  { id: "account", href: "/account" },
] as const;

export function MiniNav({ badge: badgeProp }: { badge?: number } = {}) {
  const t = useCopy();
  const path = usePathname();
  const active = NAV_HREFS.find(i => path.startsWith(i.href))?.id ?? "home";
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    // Fetch pending reconnect invites for badge count
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const [{ count: c1 }, { count: c2 }] = await Promise.all([
        supabase.from("reconnects").select("id", { count: "exact", head: true })
          .eq("user_b_id", user.id).eq("user_a_vote", true).is("user_b_vote", null),
        supabase.from("reconnects").select("id", { count: "exact", head: true })
          .eq("user_a_id", user.id).eq("user_b_vote", true).is("user_a_vote", null),
      ]);
      setNotifCount((c1 ?? 0) + (c2 ?? 0));
    });
  }, [path]); // re-fetch when navigating

  const badge = badgeProp ?? notifCount;
  const navItems = [
    { id: "home", href: "/home", label: t.nav.home },
    { id: "reconnects", href: "/reconnects", label: t.nav.reconnects },
    { id: "notifications", href: "/notifications", label: "Notifs" },
    { id: "account", href: "/account", label: t.nav.account },
  ] as const;
  return (
    <div className="np-nav">
      <div className="np-nav-shell">
        {navItems.map(item => (
          <Link key={item.id} href={item.href} className={"np-nav-item" + (active === item.id ? " is-active" : "")} style={{ position: "relative" }}>
            <NavIcon kind={item.id} />
            {item.id === "notifications" && badge && badge > 0 ? (
              <span style={{ position: "absolute", top: 6, right: 8, width: 14, height: 14, borderRadius: 999, background: "var(--danger)", color: "#fff", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{badge > 9 ? "9+" : badge}</span>
            ) : null}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Screen wrapper (scrollable body) ── */
export function Screen({ children, scroll = true, style }: { children: ReactNode; scroll?: boolean; style?: React.CSSProperties }) {
  return (
    <div className={"np-body np-enter" + (scroll ? " is-scroll" : "")} style={{ paddingBottom: scroll ? 28 : 6, ...style }}>
      {children}
    </div>
  );
}

/* ── TopBar ── */
export function TopBar({ title, sub, onBack, right }: { title?: string; sub?: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0 14px" }}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{ flex: "0 0 auto", width: 36, height: 36, borderRadius: 999, border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BackIcon />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && <p className="np-eyebrow" style={{ fontSize: 9 }}>{sub}</p>}
        {title && <p className="np-display" style={{ fontSize: 22, marginTop: sub ? 5 : 0 }}>{title}</p>}
      </div>
      {right}
    </div>
  );
}

/* ── StepDots ── */
export function StepDots({ total, active }: { total: number; active: number }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 999, background: i <= active ? "var(--accent)" : "var(--line)", transition: "width 200ms ease, background 200ms ease" }} />
      ))}
    </div>
  );
}

/* ── Field ── */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span className="np-eyebrow" style={{ fontSize: 9 }}>{label}</span>
      <div style={{ marginTop: 8 }}>{children}</div>
    </label>
  );
}

/* ── PillGroup ── */
export function PillGroup({ options, value, onChange, multi = false }: { options: string[]; value: string | string[]; onChange: (v: string | string[]) => void; multi?: boolean }) {
  const isOn = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  const toggle = (o: string) => {
    if (multi) onChange((value as string[]).includes(o) ? (value as string[]).filter(x => x !== o) : [...(value as string[]), o]);
    else onChange(o);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {options.map(o => {
        const on = isOn(o);
        return (
          <button key={o} onClick={() => toggle(o)} className="np-chip" style={{ cursor: "pointer", textTransform: "none", letterSpacing: "0.02em", fontFamily: "var(--font-sans)", fontSize: 12, padding: "8px 13px", background: on ? "var(--accent)" : "var(--panel)", color: on ? "var(--on-accent)" : "var(--text)", borderColor: on ? "var(--accent)" : "var(--line)" }}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ── ToggleRow ── */
export function ToggleRow({ label, desc, on, onToggle }: { label: string; desc?: string; on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 14, background: "transparent", border: "none", cursor: "pointer", padding: 0, color: "var(--text)", font: "inherit" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13.5 }}>{label}</p>
        {desc && <p style={{ margin: "4px 0 0", fontSize: 11.5, lineHeight: 1.4, color: "var(--muted)" }}>{desc}</p>}
      </div>
      <span style={{ flex: "0 0 auto", width: 44, height: 26, borderRadius: 999, background: on ? "var(--accent)" : "var(--line)", border: "1px solid " + (on ? "var(--accent)" : "var(--line)"), position: "relative", transition: "background 180ms ease" }}>
        <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: 999, background: on ? "var(--on-accent)" : "var(--text)", transition: "left 180ms ease" }} />
      </span>
    </button>
  );
}

/* ── Input style (shared) ── */
export const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "13px 15px", borderRadius: 14,
  border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)",
  fontSize: 13.5, outline: "none",
};
