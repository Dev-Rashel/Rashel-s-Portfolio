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
          950: "#0b0714",
          900: "#120c20",
          850: "#171024",
          800: "#221636",
          700: "#2f1f4a",
        },
        bone: {
          50: "#fbf7ff",
          100: "#f6f1ff",
          200: "#e7dcff",
          300: "#d3c4f0",
          400: "#b3a4d0",
          500: "#8f82ad",
          600: "#6a5f85",
        },
        gold: {
          200: "#ffe0d6",
          300: "#ffc4ad",
          400: "#ff7a6b",
          500: "#f05c4a",
          600: "#c94333",
        },
        mint: {
          300: "#8ff5e2",
          400: "#4be1c3",
          500: "#21c4a6",
        },
        violet: {
          300: "#c9b8ff",
          400: "#a78bfa",
          500: "#8b6beb",
        },
        ember: "#ff5c8a",
      },
      borderWidth: {
        DEFAULT: "2px",
        0: "0px",
        2: "2px",
        4: "4px",
        8: "8px",
      },
      ringWidth: {
        DEFAULT: "2px",
        0: "0px",
        1: "2px",
        2: "2px",
        4: "4px",
        8: "8px",
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
