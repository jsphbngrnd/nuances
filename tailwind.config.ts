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
      fontFamily: {
        display: ["var(--font-display)", "Didot", "Baskerville", "serif"],
        sans: ["var(--font-sans)", "Avenir Next", "Segoe UI", "sans-serif"],
        caps: ["var(--font-caps)", "Beausite Medium", "Avenir Next", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
