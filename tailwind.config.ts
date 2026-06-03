import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f7f7f4",
        bone: "#f1f1eb",
        fog: "#000000",
        stone: "#8d8d87",
        ember: "#d9d9d2",
        mint: "#cfcfca",
        sky: "#d7d7d3",
        butter: "#e5e5de",
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "Didot",
          "Baskerville",
          "\"Times New Roman\"",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "\"Beausite Clear\"",
          "\"Beausite Clear Regular\"",
          "\"Beausite\"",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: "0.5rem",
      },
      backgroundImage: {
        "room-glow":
          "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 34%), linear-gradient(180deg, rgba(18,18,18,0.98), rgba(8,8,8,0.98))",
      },
      boxShadow: {
        card: "0 28px 80px rgba(0, 0, 0, 0.42)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 500ms ease forwards",
        pulseLine: "pulseLine 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
