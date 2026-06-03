import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { DayNightTheme } from "@/components/day-night-theme";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { getLocale } from "@/lib/server-locale";

const display = localFont({
  src: "./fonts/ConcretteS-TRIAL-Light.woff2",
  variable: "--font-display",
  display: "swap",
});

const sans = localFont({
  src: "./fonts/Beausite-Classic-Clear.ttf",
  variable: "--font-sans",
  display: "swap",
});

const caps = localFont({
  src: "./fonts/Beausite-Classic-Medium.ttf",
  variable: "--font-caps",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NUANCE",
  description: "Meet strangers through ideas, not profiles.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${display.variable} ${sans.variable} ${caps.variable}`}
    >
      <body>
        <DayNightTheme />
        <LanguageToggle locale={locale} />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
