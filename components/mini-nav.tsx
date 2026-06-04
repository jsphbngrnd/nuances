import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function NavIcon({ kind }: { kind: "home" | "start" | "reconnects" | "account" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {kind === "home" && (
        <>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6.5 10v9h11v-9" />
        </>
      )}
      {kind === "start" && (
        <path d="M12 3.75 14.2 8.2l4.9.72-3.55 3.46.84 4.87L12 14.93l-4.39 2.32.84-4.87-3.55-3.46 4.9-.72L12 3.75Z" />
      )}
      {kind === "reconnects" && (
        <path d="M12 20.25s-6.75-4.13-6.75-9.6A4.15 4.15 0 0 1 9.45 6.5c1.14 0 2.16.45 2.55 1.29.39-.84 1.41-1.29 2.55-1.29a4.15 4.15 0 0 1 4.2 4.15c0 5.47-6.75 9.6-6.75 9.6Z" />
      )}
      {kind === "account" && (
        <>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M4.5 20c0-3.31 3.36-6 7.5-6s7.5 2.69 7.5 6" />
        </>
      )}
    </svg>
  );
}

const NAV_LABELS = {
  en: { home: "Home", start: "Start", reconnects: "Reconnects", account: "Account" },
  fr: { home: "Accueil", start: "Start", reconnects: "Recontacts", account: "Compte" },
};

export function MiniNav({ current, locale }: { current: string; locale: Locale }) {
  const labels = NAV_LABELS[locale === "fr" ? "fr" : "en"];

  const items = [
    { href: "/home" as const, kind: "home" as const, label: labels.home },
    { href: "/start" as const, kind: "start" as const, label: labels.start },
    { href: "/reconnects" as const, kind: "reconnects" as const, label: labels.reconnects },
    { href: "/account" as const, kind: "account" as const, label: labels.account },
  ];

  return (
    <nav className="mini-nav-shell">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("mini-nav-item", current === item.href && "mini-nav-item-active")}
          >
            <NavIcon kind={item.kind} />
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em]">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
