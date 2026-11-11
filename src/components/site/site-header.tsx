"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Magnetic } from "./magnetic";
import type { NavItem } from "@/lib/models/shared";

type HeaderProps = {
  navItems: NavItem[];
  siteName: string;
  logoMark: string;
  available: boolean;
};

export function SiteHeader({ navItems, siteName, logoMark, available }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveHash("");
      return;
    }
    const ids = navItems
      .map((item) => (item.href.includes("#") ? item.href.split("#")[1] : ""))
      .filter(Boolean);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.01, 0.2, 0.5] }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [navItems, pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && (!activeHash || activeHash === "#home");
    if (href.startsWith("/#")) return pathname === "/" && activeHash === href.slice(1);
    if (href.startsWith("/")) return pathname.startsWith(href);
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[120] transition-all duration-500",
          scrolled ? "border-b border-[var(--line)] bg-[var(--nav-bg)] backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <div className="frame flex h-[74px] items-center justify-between gap-6">
          <Link href="/" className="group flex items-center gap-3" aria-label={`${siteName} home`}>
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-[var(--line-strong)]">
              <span className="font-display text-lg leading-none text-[var(--foreground)] transition-transform duration-500 group-hover:-translate-y-8">
                {logoMark}
              </span>
              <span className="absolute translate-y-8 font-display text-lg italic text-[var(--accent)] transition-transform duration-500 group-hover:translate-y-0">
                {logoMark.slice(0, 1)}
              </span>
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.22em]">{siteName}</span>
              <span className="mt-1 text-[0.55rem] uppercase tracking-[0.22em] text-[var(--muted)]">
                Full-stack developer
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-[var(--line)] bg-[var(--surface)]/35 p-1 lg:flex" aria-label="Primary navigation">
            {navItems.slice(0, 8).map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                  isActive(item.href) ? "text-[var(--background)]" : "text-[var(--foreground-soft)] hover:text-[var(--foreground)]"
                )}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)] xl:flex">
              <span className={cn("h-1.5 w-1.5 rounded-full", available ? "bg-emerald-400" : "bg-[var(--muted)]")} />
              {available ? "Available" : "Unavailable"}
            </span>
            <ThemeToggle compact />
            <Magnetic className="hidden md:block" strength={0.18}>
              <Link href="/#contact" className="btn-primary !px-5 !py-2.5">
                <span>Let’s talk</span>
                <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={open}
            >
              <Menu size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[150] flex flex-col bg-[var(--background)] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="frame flex h-[74px] items-center justify-between border-b border-[var(--line)]">
              <span className="font-display text-xl">{siteName}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)]"
                aria-label="Close navigation menu"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="frame flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-10" aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href + item.label}
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + index * 0.055, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline justify-between border-b border-[var(--line)] py-3.5"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-[0.58rem] uppercase tracking-[0.2em] text-[var(--accent)]">
                        0{index + 1}
                      </span>
                      <span className="font-display text-[clamp(1.7rem,7vw,2.6rem)] leading-none transition-transform duration-300 group-hover:translate-x-2">
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight className="text-[var(--muted)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="frame flex items-center justify-between border-t border-[var(--line)] py-5 text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted)]">
              <span>Dhaka, Bangladesh</span>
              <span>Code · Design · Motion</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
