"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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

/* ── StatusBar ── */
export function StatusBar() {
  return (
    <div className="np-status">
      <span className="np-time">9:41</span>
      <span className="np-pill">Nuance</span>
      <span className="np-meta" style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <svg width="16" height="11" viewBox="0 0 24 16" fill="currentColor" aria-hidden="true">
          <rect x="0" y="3" width="4" height="10" rx="1" />
          <rect x="6" y="1" width="4" height="12" rx="1" />
          <rect x="12" y="0" width="4" height="13" rx="1" opacity="0.5" />
        </svg>
        <svg width="20" height="11" viewBox="0 0 28 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <rect x="0.7" y="0.7" width="22" height="12.6" rx="3" />
          <rect x="2.6" y="2.6" width="15" height="8.8" rx="1.4" fill="currentColor" stroke="none" />
          <rect x="24" y="4.5" width="2.4" height="5" rx="1.2" fill="currentColor" stroke="none" />
        </svg>
      </span>
    </div>
  );
}

/* ── MiniNav ── */
function NavIcon({ kind }: { kind: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "start") return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M12 3.75 14.2 8.2l4.9.72-3.55 3.46.84 4.87L12 14.93l-4.39 2.32.84-4.87-3.55-3.46 4.9-.72L12 3.75Z" /></svg>;
  if (kind === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M4 10.5 12 4l8 6.5" /><path {...p} d="M6.5 10v9h11v-9" /></svg>;
  if (kind === "reconnects") return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M12 20.25s-6.75-4.13-6.75-9.6A4.15 4.15 0 0 1 9.45 6.5c1.14 0 2.16.45 2.55 1.29.39-.84 1.41-1.29 2.55-1.29a4.15 4.15 0 0 1 4.2 4.15c0 5.47-6.75 9.6-6.75 9.6Z" /></svg>;
  if (kind === "account") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle {...p} cx="12" cy="8" r="3.5" /><path {...p} d="M4.5 20c0-3.31 3.36-6 7.5-6s7.5 2.69 7.5 6" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path {...p} d="M12 3.4 19 6.1v4.9c0 4.4-2.9 7.4-7 8.9-4.1-1.5-7-4.5-7-8.9V6.1L12 3.4Z" /><path {...p} d="m8.8 11.9 2.2 2.2 4.2-4.4" /></svg>;
}

const NAV_ITEMS = [
  { id: "start", label: "Start", href: "/start" },
  { id: "home", label: "Home", href: "/home" },
  { id: "reconnects", label: "Reconnects", href: "/reconnects" },
  { id: "account", label: "Account", href: "/account" },
] as const;

export function MiniNav() {
  const path = usePathname();
  const active = NAV_ITEMS.find(i => path.startsWith(i.href))?.id ?? "home";
  return (
    <div className="np-nav">
      <div className="np-nav-shell">
        {NAV_ITEMS.map(item => (
          <Link key={item.id} href={item.href} className={"np-nav-item" + (active === item.id ? " is-active" : "")}>
            <NavIcon kind={item.id} />
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
