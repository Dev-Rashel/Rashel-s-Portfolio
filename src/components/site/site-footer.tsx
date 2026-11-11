"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SocialIcon } from "./social-icon";
import { Magnetic } from "./magnetic";

type FooterProps = {
  siteName: string;
  footer: {
    tagline: string;
    copyright: string;
    links: { label: string; href: string }[];
    showSocials: boolean;
    bigText: string;
  };
  socials: { platform: string; label: string; url: string; icon?: string }[];
  email: string;
  available: boolean;
  availability: string;
};

export function SiteFooter({ siteName, footer, socials, email, available, availability }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 overflow-hidden border-t border-[var(--line)] bg-[var(--background-elevated)]">
      <div className="frame grid gap-14 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Link href="/" className="font-display text-3xl">
            {siteName}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted)]">{footer.tagline}</p>
          <div className="mt-7 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.17em]">
            <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-emerald-400" : "bg-[var(--muted)]"}`} />
            <span className="text-[var(--foreground-soft)]">{availability}</span>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Connect</p>
          <div className="mt-5 flex flex-col items-start gap-3">
            {socials.map((social) => (
              <a
                key={social.url + social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline flex items-center gap-2 text-sm text-[var(--foreground-soft)] transition-colors hover:text-[var(--accent)]"
              >
                <SocialIcon platform={social.platform} icon={social.icon} size={13} />
                {social.label}
                <ArrowUpRight size={11} />
              </a>
            ))}
            <a
              href={`mailto:${email}`}
              className="link-underline mt-1 text-sm text-[var(--accent)]"
            >
              {email}
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Explore</p>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--foreground-soft)]">
            {footer.links.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="link-underline w-fit hover:text-[var(--accent)]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Say hello</p>
          <p className="mt-5 text-sm leading-relaxed text-[var(--foreground-soft)]">
            Good work starts with a conversation.
          </p>
          <Magnetic strength={0.15} className="mt-4">
            <Link href="/#contact" className="btn-ghost !px-4 !py-2.5">
              Contact <ArrowUpRight size={13} />
            </Link>
          </Magnetic>
        </div>
      </div>

      <div className="relative border-y border-[var(--line)] py-5 sm:py-7">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {[0, 1, 2].map((index) => (
                <span key={index} className="flex items-center">
                  <span className="px-6 font-display text-[clamp(2rem,4.6vw,4.2rem)] italic leading-none text-[var(--foreground)]/90">
                    {footer.bigText}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="frame flex flex-col items-center justify-between gap-5 py-6 text-[0.58rem] uppercase tracking-[0.18em] text-[var(--muted)] sm:flex-row">
        <p>© {year} {footer.copyright}. All rights reserved.</p>
        <p className="hidden md:block">Built with Next.js · MongoDB · Motion</p>
        <button
          type="button"
          onClick={() => {
            if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
        >
          Back to top <ArrowUp size={12} />
        </button>
      </div>
    </footer>
  );
}
