import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1F3A5F",
          50: "#EEF2F7",
          100: "#D6E0EC",
          600: "#27466F",
          700: "#1F3A5F",
          800: "#162B47",
          900: "#0F1F33",
        },
        teal: {
          DEFAULT: "#2E8B8B",
          50: "#EAF2F2",
          100: "#D2E6E6",
          500: "#2E8B8B",
          600: "#287A7A",
          700: "#1F6161",
        },
        coral: { DEFAULT: "#E8924A", 600: "#D67E36" },
        amber: { DEFAULT: "#F2B705", 600: "#D9A404" },
        cream: "#F7F5F1",
        wash: "#EAF2F2",
        ok: "#2E8B5B",
        due: "#C9A227",
        alert: "#C0492F",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1rem" }],
        xs: ["0.875rem", { lineHeight: "1.25rem" }],
        sm: ["1rem", { lineHeight: "1.6" }],
        base: ["1rem", { lineHeight: "1.7" }],
        lg: ["1.25rem", { lineHeight: "1.6" }],
        xl: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "2xl": ["2.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "3xl": ["4rem", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "4xl": ["5.5rem", { lineHeight: "0.94", letterSpacing: "-0.035em" }],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(31,58,95,0.04), 0 8px 24px rgba(31,58,95,0.06)",
        lift: "0 2px 4px rgba(31,58,95,0.05), 0 18px 48px rgba(31,58,95,0.12)",
        glow: "0 10px 40px rgba(46,139,139,0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
