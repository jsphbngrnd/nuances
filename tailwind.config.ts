import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — resolve to CSS vars (dark/light via .dark class)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        positive: "var(--positive)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        surface: "var(--surface)",
        "surface-strong": "var(--surface-strong)",
        "border-soft": "var(--border-soft)",
        // Legacy named palette (kept for backward compat)
        ink: "#f7f7f4",
        bone: "#f1f1eb",
        fog: "#000000",
        stone: "#8d8d87",
        ember: "#d9d9d2",
      },
      fontFamily: {
        display: ["var(--font-display)", "Concrette", "Didot", "Baskerville", "serif"],
        sans: ["var(--font-sans)", "Beausite", "Avenir Next", "Segoe UI", "sans-serif"],
        caps: ["var(--font-caps)", "Beausite Medium", "Beausite", "Avenir Next", "sans-serif"],
      },
      fontSize: {
        "display-1": ["33px", { lineHeight: "0.94", letterSpacing: "-0.04em" }],
        "display-2": ["25px", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "display-3": ["22px", { lineHeight: "1", letterSpacing: "-0.04em" }],
        quote: ["27px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        label: ["10.5px", { lineHeight: "1.2", letterSpacing: "0.3em" }],
        micro: ["9px", { lineHeight: "1.2", letterSpacing: "0.22em" }],
      },
      borderRadius: {
        sm: "14px",
        md: "18px",
        lg: "var(--radius)",   // 22px
        xl: "26px",
        "2xl": "46px",
        pill: "9999px",
      },
      boxShadow: {
        pop: "0 18px 50px rgba(0,0,0,0.40)",
        card: "0 28px 80px rgba(0,0,0,0.42)",
        device: "0 36px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        "room-glow":
          "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 30%), linear-gradient(180deg, rgba(16,16,16,0.985), rgba(6,6,6,0.995))",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.7)" },
        },
      },
      animation: {
        rise: "rise 500ms ease both",
        "pulse-dot": "pulseDot 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
