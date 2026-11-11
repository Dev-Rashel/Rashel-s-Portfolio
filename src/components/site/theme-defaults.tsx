"use client";

import { useEffect } from "react";

export function ThemeDefaults({ defaultTheme }: { defaultTheme: "dark" | "light" | "system" }) {
  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme");
    if (stored) return;
    const resolved =
      defaultTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
        : defaultTheme;
    document.documentElement.setAttribute("data-theme", resolved);
    localStorage.setItem("portfolio-theme", resolved);
  }, [defaultTheme]);
  return null;
}
