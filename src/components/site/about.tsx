"use client";

import { ArrowUpRight, Compass, Flag, GraduationCap, Sparkle } from "lucide-react";
import Link from "next/link";
import type { PublicProfile } from "@/lib/data";
import type { SectionCopy } from "@/lib/models/SiteSettings";
import { ParallaxImage } from "./parallax-image";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

export function About({ profile, copy }: { profile: PublicProfile; copy: SectionCopy }) {
  const paragraphs = (profile.aboutBio || "").split(/\n\n+/).filter(Boolean);
  const lead = paragraphs[0] || profile.shortBio;
  const rest = paragraphs.slice(1);

  return (
    <section id="about" className="section-shell relative border-t border-[var(--line)]">
      <div className="frame">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          index="01"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="relative">
                <ParallaxImage
                  src={profile.aboutImage || profile.profileImage}
                  alt={`${profile.fullName} at work`}
                  className="aspect-[4/5] w-full rounded-[1rem] border border-[var(--line)]"
                  imageClassName="grayscale-[30%]"
                  strength={70}
                />
                <div className="absolute inset-0 rounded-[1rem] bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl italic">{profile.fullName}</p>
                    <p className="mt-1 text-[0.58rem] uppercase tracking-[0.2em] text-white/55">{profile.location}</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md">
                    <ArrowUpRight size={15} />
                  </span>
                </div>
                <span className="absolute -left-3 top-8 hidden rounded-full border border-[var(--line)] bg-[var(--background)] px-3 py-1 text-[0.52rem] uppercase tracking-[0.2em] text-[var(--muted)] md:block">
                  {profile.designation}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {profile.interests.slice(0, 4).map((interest, index) => (
                  <Reveal key={interest} delay={index * 0.06}>
                    <div className="flex items-center gap-2 rounded-full border border-[var(--line)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.12em] text-[var(--foreground-soft)]">
                      <Sparkle size={10} className="text-[var(--accent)]" />
                      <span className="truncate">{interest}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[clamp(1.25rem,1.9vw,1.75rem)] font-light leading-[1.45] text-[var(--foreground)]">
                {lead}
              </p>
            </Reveal>

            {rest.length > 0 && (
              <Reveal delay={0.1}>
                <div className="mt-6 max-w-2xl space-y-4 text-sm leading-[1.85] text-[var(--muted)] sm:text-[0.96rem]">
                  {rest.map((paragraph) => (
                    <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.16}>
              <blockquote className="my-11 border-y border-[var(--line)] py-8">
                <p className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] italic leading-[1.22] text-[var(--accent-soft)]">
                  “{profile.tagline}”
                </p>
                <footer className="mt-4 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  — {profile.fullName}, {profile.designation}
                </footer>
              </blockquote>
            </Reveal>

            <div className="grid gap-8 sm:grid-cols-2">
              <Reveal delay={0.05}>
                <div className="group">
                  <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                    <Compass size={13} /> The journey
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{profile.journey}</p>
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="group">
                  <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                    <Flag size={13} /> What’s next
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{profile.goals}</p>
                </div>
              </Reveal>
            </div>

            <div className="mt-10 grid gap-5 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
              <Reveal>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line)] text-[var(--accent)]">
                    <GraduationCap size={15} />
                  </span>
                  <div>
                    <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Education</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-soft)]">{profile.educationSummary}</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Selected recognition</p>
                  <ul className="mt-3 space-y-2">
                    {profile.achievements.length > 0 ? (
                      profile.achievements.slice(0, 3).map((achievement) => (
                        <li key={achievement} className="flex gap-2 text-sm text-[var(--foreground-soft)]">
                          <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                          {achievement}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-[var(--muted)]">Recognition and milestones will appear here.</li>
                    )}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <Link
                href="/#contact"
                className="group mt-10 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]"
              >
                <span className="link-underline">More about working together</span>
                <ArrowUpRight size={13} className="text-[var(--accent)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
