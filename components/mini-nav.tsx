import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function NavIcon({
  kind,
  active,
}: {
  kind: "start" | "home" | "reconnects" | "settings";
  active: boolean;
}) {
  const stroke = "currentColor";

  if (kind === "start") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden="true">
        <path
          d="M12 3.75 14.2 8.2l4.9.72-3.55 3.46.84 4.87L12 14.93l-4.39 2.32.84-4.87-3.55-3.46 4.9-.72L12 3.75Z"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "home") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden="true">
        <path d="M4 10.5 12 4l8 6.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 10v9h11v-9" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "reconnects") {
    return (
      <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden="true">
        <path
          d="M12 20.25s-6.75-4.13-6.75-9.6A4.15 4.15 0 0 1 9.45 6.5c1.14 0 2.16.45 2.55 1.29.39-.84 1.41-1.29 2.55-1.29a4.15 4.15 0 0 1 4.2 4.15c0 5.47-6.75 9.6-6.75 9.6Z"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem]" fill="none" aria-hidden="true">
      <path
        d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
        stroke={stroke}
        strokeWidth="1.8"
      />
      <path
        d="m19 12 .96-.56-.96.56Zm-1.02-4.1-.29-1.08.29 1.08Zm-2.88-2.88 1.08-.29-1.08.29ZM12 5l.56-.96L12 5Zm-4.1 1.02 1.08.29-1.08-.29ZM5.02 8.9l-1.08-.29 1.08.29ZM5 12l-.96.56L5 12Zm1.02 4.1.29 1.08-.29-1.08Zm2.88 2.88-.29 1.08.29-1.08ZM12 19l-.56.96L12 19Zm4.1-1.02-1.08-.29 1.08.29Zm2.88-2.88 1.08.29-1.08-.29ZM19 12c0 .34.2.65.5.8l.54.28a1.1 1.1 0 0 1 .53 1.39l-.08.24a1.1 1.1 0 0 1-1.16.73l-.6-.08a.95.95 0 0 0-.98.45l-.33.5a1.1 1.1 0 0 1-1.32.44l-.24-.08a1.1 1.1 0 0 1-.72-1.16l.07-.6a.95.95 0 0 0-.45-.98l-.5-.33a1.1 1.1 0 0 1-.44-1.32l.08-.24a1.1 1.1 0 0 1 1.16-.72l.6.07c.38.05.74-.12.98-.45l.33-.5a1.1 1.1 0 0 1 1.32-.44l.24.08a1.1 1.1 0 0 1 .72 1.16l-.07.6c-.05.38.12.74.45.98l.5.33c.17.11.3.27.37.45"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      />
    </svg>
  );
}

export function MiniNav({ current, locale }: { current: string; locale: Locale }) {
  const t = getCopy(locale);
  const items = [
    { href: "/start", label: t.nav.start, kind: "start" as const },
    { href: "/home", label: t.nav.home, kind: "home" as const },
    { href: "/reconnects", label: t.nav.reconnects, kind: "reconnects" as const },
    { href: "/settings", label: t.nav.safety, kind: "settings" as const },
  ] as const;

  return (
    <nav className="mini-nav-shell">
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const active = current === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mini-nav-item",
                active && "mini-nav-item-active"
              )}
            >
              <NavIcon kind={item.kind} active={active} />
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
