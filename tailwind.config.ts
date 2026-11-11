import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070706",
          900: "#0b0b09",
          850: "#10100d",
          800: "#161612",
          700: "#1f1f19",
        },
        bone: {
          50: "#faf7f0",
          100: "#f2ece0",
          200: "#e6dccb",
          300: "#d6c8b2",
          400: "#b3a48d",
          500: "#8d806d",
          600: "#6a5f50",
        },
        gold: {
          200: "#f0e2c4",
          300: "#e3cda0",
          400: "#d3b47c",
          500: "#c09a5b",
          600: "#a67d40",
        },
        ember: "#e46d3d",
      },
      fontFamily: {
        sans: ["Manrope Variable", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
      },
      letterSpacing: {
        "ultra-wide": "0.32em",
      },
      maxWidth: {
        frame: "1240px",
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        "marquee-slow": "marquee 55s linear infinite",
        "spin-slow": "spin 18s linear infinite",
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.04)" },
        },
      },
      boxShadow: {
        glow: "0 0 80px rgba(211, 180, 124, 0.14)",
        frame: "0 30px 100px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
