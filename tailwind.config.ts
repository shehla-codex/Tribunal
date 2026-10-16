import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF8F5",
          100: "#F6F3EE", // Page cream background
          200: "#EDE7DC",
          300: "#E2D8C7",
        },
        card: {
          surface: "#FBFAF8", // Cards background
          border: "#E8E2D8",  // Card borders
        },
        hero: {
          charcoal: "#151517", // Courtroom hero base
          stone: "#3C3538",    // Courtroom stone pillars
        },
        wood: {
          dark: "#2A1D19",     // Courtroom dark mahogany
          light: "#40312D",    // Courtroom secondary wood
        },
        gold: {
          primary: "#B67F3D",  // Primary gold accent
          light: "#E5C994",    // Subtle gold highlight
          amber: "#E0A64A",    // Amber judge accent
        },
        teal: {
          accent: "#43877C",   // Active teal pills & tags
          court: "#3D9A85",    // Green court accent
        },
        prosecutor: {
          crimson: "#9B2C2C",  // Strict prosecutor crimson
          red: "#C53030",
        },
        defense: {
          blue: "#4A86C5",     // Defense blue (NOT navy)
        },
        charcoal: {
          DEFAULT: "#1E1E20",  // Primary text
          muted: "#6E6966",    // Secondary text
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(1.5) rotate(-12deg)" },
          "50%": { opacity: "0.8", transform: "scale(0.95) rotate(-3deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-5deg)" },
        },
      },
      animation: {
        shake: "shake 0.4s ease-in-out",
        stamp: "stamp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
