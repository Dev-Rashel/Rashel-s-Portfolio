"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`group relative grid place-items-center rounded-full border border-[var(--line)] text-[var(--foreground-soft)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] ${
        compact ? "h-8 w-8" : "h-10 w-10"
      }`}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -60, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="grid place-items-center"
      >
        {theme === "dark" ? <Moon size={compact ? 13 : 15} strokeWidth={1.6} /> : <Sun size={compact ? 13 : 15} strokeWidth={1.6} />}
      </motion.span>
    </motion.button>
  );
}
