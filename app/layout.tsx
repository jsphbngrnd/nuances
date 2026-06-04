import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { DeviceShell } from "@/components/device-shell";

const display = localFont({ src: "./fonts/ConcretteS-TRIAL-Light.woff2", variable: "--font-display", display: "swap" });
const sans = localFont({ src: "./fonts/Beausite-Classic-Clear.ttf", variable: "--font-sans", display: "swap" });
const caps = localFont({ src: "./fonts/Beausite-Classic-Medium.ttf", variable: "--font-caps", display: "swap" });

export const metadata: Metadata = {
  title: "NUANCE",
  description: "Meet strangers through ideas, not profiles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${caps.variable}`}>
      <body>
        <DeviceShell>{children}</DeviceShell>
      </body>
    </html>
  );
}
