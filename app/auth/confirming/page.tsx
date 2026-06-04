"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBar, Screen, ArrowIcon } from "@/components/ui";
import { useCopy } from "@/lib/use-copy";

export default function ConfirmingPage() {
  const t = useCopy();
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="nuance-phone">


      <Screen scroll={false} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <div style={{ position: "relative", width: 76, height: 76, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: 999, border: "1px solid var(--line)" }} />
            {!done ? (
              <>
                <span style={{ position: "absolute", inset: 0, borderRadius: 999, border: "2px solid transparent", borderTopColor: "var(--accent)", animation: "npSpin 0.9s linear infinite" }} />
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>☾</span>
              </>
            ) : (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            )}
          </div>
          <h1 className="np-display" style={{ fontSize: 26, marginTop: 26 }}>
            {done ? t.confirming.done : t.confirming.pending}
          </h1>
          <p style={{ margin: "12px auto 0", fontSize: 12.5, lineHeight: 1.45, color: "var(--muted)", maxWidth: "28ch" }}>
            {done ? t.confirming.doneSub : t.confirming.pendingSub}
          </p>
          {done && (
            <button className="np-btn np-btn-ghost" style={{ marginTop: 24 }} onClick={() => router.push("/auth?tab=signin")}>
              {t.confirming.back} <ArrowIcon />
            </button>
          )}
        </div>
      </Screen>
    </div>
  );
}
