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
          950: "#0b0817",
          900: "#0f0b20",
          850: "#151027",
          800: "#1c1633",
          700: "#241b3f",
        },
        bone: {
          50: "#fbf8ff",
          100: "#f4f0fc",
          200: "#e7def7",
          300: "#d3c6ea",
          400: "#b3a6cd",
          500: "#9189aa",
          600: "#6f6688",
        },
        gold: {
          200: "#eadcff",
          300: "#d9c4ff",
          400: "#b794f6",
          500: "#9d74e8",
          600: "#7f56cc",
        },
        mint: {
          300: "#f7c6dc",
          400: "#f0a6ca",
          500: "#dd7fab",
        },
        violet: {
          300: "#bcd4ff",
          400: "#8fb8ff",
          500: "#6b9bf0",
        },
        ember: "#f0a6ca",
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
        glow: "0 0 80px rgba(183, 148, 246, 0.16)",
        frame: "0 30px 100px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
