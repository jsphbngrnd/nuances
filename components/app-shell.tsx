import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { MiniNav } from "@/components/mini-nav";

export function AppShell({
  locale,
  currentNav,
  showNav = true,
  header,
  children,
}: {
  locale: Locale;
  currentNav?: string;
  showNav?: boolean;
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="app-frame app-viewport">
      <div className="device-shell">
        <div className="device-notch" />

        <div className="device-status">
          <span className="device-status-time">9:41</span>
          <span className="device-status-pill">NUANCE</span>
        </div>

        <div className="app-shell-body">
          {header ? <div className="app-shell-header">{header}</div> : null}
          {children}
        </div>

        {showNav && currentNav ? (
          <div className="app-shell-nav">
            <MiniNav current={currentNav} locale={locale} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
