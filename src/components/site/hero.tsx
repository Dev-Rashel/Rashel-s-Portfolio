"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowDownToLine, ArrowRight, ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import type { PublicProfile } from "@/lib/data";
import { CharReveal } from "./char-reveal";
import { TiltImage } from "./tilt-image";
import { Magnetic } from "./magnetic";
import { Counter } from "./counter";
import { HeroAtmosphere } from "./hero-atmosphere";
import { SocialIcon } from "./social-icon";
import { usePreloaderReady } from "./preloader-provider";

export function Hero({ profile, scrollTarget = "about" }: { profile: PublicProfile; scrollTarget?: string }) {
  const ready = usePreloaderReady();
  const nameParts = profile.fullName.trim().split(/\s+/);
  const first = nameParts[0] || profile.fullName;
  const rest = nameParts.slice(1).join(" ") || "";
  const resumeUrl = profile.resume?.url || profile.ctas?.resume?.url;

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[74px]">
      <HeroAtmosphere />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(var(--accent-rgb),0.09),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[8%] hidden w-px bg-gradient-to-b from-transparent via-[var(--line)] to-transparent lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-px bg-gradient-to-b from-transparent via-[var(--line)] to-transparent lg:block" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--line) 1px, transparent 1px), linear-gradient(to bottom, var(--line) 1px, transparent 1px)",
          backgroundSize: "min(12vw, 160px) min(12vw, 160px)",
          maskImage: "radial-gradient(ellipse at center, transparent 22%, black 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 22%, black 100%)",
        }}
      />

      <div className="frame relative z-10 flex flex-1 flex-col justify-center pb-8 pt-8 sm:pt-10">
        <motion.div
          className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between"
          {...fade(0.05)}
        >
          <div className="flex items-center gap-3">
            <span className={`h-1.5 w-1.5 rounded-full ${profile.available ? "bg-emerald-400" : "bg-[var(--muted)]"}`} />
            <span>{profile.availability}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <MapPin size={11} /> {profile.location}
            </span>
            <span className="hidden sm:inline">Portfolio / 2026</span>
          </div>
        </motion.div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-5 lg:py-10">
          <div className="lg:col-span-8">
            <motion.p
              className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]"
              {...fade(0.15)}
            >
              {profile.designation}
            </motion.p>

            <h1 className="display-title select-none text-[clamp(3.4rem,8.2vw,7.4rem)]">
              <CharReveal text={first} className="block text-[var(--foreground)]" delay={0.2} playOnLoad />
              {rest && (
                <CharReveal
                  text={rest}
                  className="block italic text-[var(--accent-soft)]"
                  delay={0.32}
                  playOnLoad
                />
              )}
            </h1>

            <div className="mt-7 grid gap-7 border-t border-[var(--line)] pt-7 sm:grid-cols-[1.15fr_0.85fr] lg:max-w-3xl">
              <motion.div {...fade(0.65)}>
                <p className="max-w-md text-sm leading-relaxed text-[var(--foreground-soft)] sm:text-[0.95rem]">
                  {profile.heroIntro}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {profile.ctas?.projects?.enabled && (
                    <Magnetic strength={0.15}>
                      <Link href={profile.ctas.projects.url || "/#projects"} className="btn-primary group">
                        <span>{profile.ctas.projects.label || "View projects"}</span>
                        <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </Magnetic>
                  )}
                  {profile.ctas?.contact?.enabled && (
                    <Magnetic strength={0.15}>
                      <Link href={profile.ctas.contact.url || "/#contact"} className="btn-ghost group">
                        <span>{profile.ctas.contact.label || "Contact me"}</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Magnetic>
                  )}
                </div>
              </motion.div>

              <motion.div className="flex flex-col justify-between gap-5" {...fade(0.8)}>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-fit items-center gap-2 border-b border-[var(--line-strong)] pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--foreground-soft)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <ArrowDownToLine size={13} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                    {profile.ctas?.resume?.label || "Download résumé"}
                  </a>
                )}
                <div className="flex items-center gap-3">
                  {profile.socials.map((social) => (
                    <a
                      key={social.url + social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-[var(--foreground-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      <SocialIcon platform={social.platform} icon={social.icon} size={13} />
                    </a>
                  ))}
                </div>
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted)]">Scroll to explore</p>
              </motion.div>
            </div>

            {profile.stats?.length > 0 && (
              <motion.div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 lg:max-w-3xl" {...fade(0.95)}>
                {profile.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-display text-3xl leading-none text-[var(--foreground)]">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </span>
                    <span className="mt-1.5 text-[0.56rem] uppercase tracking-[0.18em] text-[var(--muted)]">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <motion.div
            className="relative mx-auto w-full max-w-[380px] lg:col-span-4 lg:max-w-none"
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={ready ? { opacity: 1, clipPath: "inset(0% 0 0 0)" } : {}}
            transition={{ duration: 1.25, delay: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] border border-[var(--line)] opacity-60" />
              <div className="absolute -right-4 -top-4 z-20 flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--background)]/80 px-3 py-1.5 text-[0.52rem] uppercase tracking-[0.18em] text-[var(--foreground-soft)] backdrop-blur-md">
                <Sparkles size={10} className="text-[var(--accent)]" /> Open to build
              </div>
              <TiltImage
                src={profile.profileImage}
                alt={`${profile.fullName} — ${profile.designation}`}
                className="aspect-[4/5] w-full"
                badge={`${profile.location} · ${new Date().getFullYear()}`}
              />
              <div className="absolute -bottom-6 -right-3 hidden h-24 w-24 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--background)] sm:flex lg:-right-7">
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
                  <defs>
                    <path id="circlePath" d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
                  </defs>
                  <text className="fill-[var(--muted)] text-[7.4px] uppercase tracking-[2.4px]">
                    <textPath href="#circlePath">FullStack · Developer · Designer · </textPath>
                  </text>
                </svg>
                <span className="font-display text-lg italic text-[var(--accent)]">RM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="frame relative z-10 flex items-center justify-between gap-4 border-t border-[var(--line)] py-5"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.15 }}
      >
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)]">
          <span>Code</span>
          <span className="text-[var(--line-strong)]">/</span>
          <span>Design</span>
          <span className="text-[var(--line-strong)]">/</span>
          <span>Motion</span>
        </div>
        <a
          href={`#${scrollTarget}`}
          className="group flex items-center gap-2 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-soft)] transition-colors hover:text-[var(--accent)]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] transition-transform duration-300 group-hover:translate-y-1">
            <ArrowDown size={12} />
          </span>
          <span className="hidden sm:inline">Discover</span>
        </a>
      </motion.div>
    </section>
  );
}
