"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import type { SectionCopy } from "@/lib/models/SiteSettings";
import { SectionHeading } from "./section-heading";
import { SkillIcon } from "./skill-icon";

type Skill = {
  _id?: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  image?: string;
  description?: string;
};

const categoryTones: Record<string, { base: string; soft: string }> = {
  Frontend: { base: "var(--accent)", soft: "var(--accent-soft)" },
  Backend: { base: "var(--accent-2)", soft: "#8ff5e2" },
  Database: { base: "var(--accent-3)", soft: "#c9b8ff" },
  Tools: { base: "var(--accent-soft)", soft: "#ffe0d6" },
};

function toneFor(category: string) {
  return categoryTones[category] || categoryTones.Frontend;
}

function clampLevel(level: number) {
  return Math.min(100, Math.max(0, Number(level) || 0));
}

export function Skills({ skills, copy }: { skills: Skill[]; copy: SectionCopy }) {
  return (
    <section id="skills" className="section-shell relative overflow-hidden border-t border-[var(--line)] bg-[var(--background-elevated)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(var(--accent-rgb),0.08),transparent_55%),radial-gradient(ellipse_at_85%_100%,rgba(var(--accent-3-rgb),0.08),transparent_55%)]"
        aria-hidden
      />
      <div className="frame relative">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} index="02" />

        {skills.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill, index) => {
              const level = clampLevel(skill.level);
              const tone = toneFor(skill.category);
              return (
                <motion.article
                  key={skill._id || skill.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.3) }}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--line-strong)] hover:bg-[var(--surface-soft)]"
                  style={{ "--tone": tone.base, "--tone-soft": tone.soft } as CSSProperties}
                >
                  <span
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                    style={{ background: tone.base }}
                    aria-hidden
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--line)]"
                        style={{
                          color: tone.base,
                          background: "color-mix(in srgb, var(--tone) 12%, transparent)",
                        }}
                      >
                        {skill.image ? (
                          <Image
                            src={skill.image}
                            alt=""
                            width={22}
                            height={22}
                            unoptimized
                            className="h-[22px] w-[22px] object-contain"
                          />
                        ) : (
                          <SkillIcon name={skill.icon} size={17} />
                        )}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-[0.95rem] font-semibold text-[var(--foreground)]">{skill.name}</h3>
                        <p className="mt-0.5 text-[0.52rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                          {skill.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className="shrink-0 font-display text-2xl leading-none tabular-nums"
                      style={{ color: tone.base }}
                    >
                      {level}%
                    </span>
                  </div>

                  {skill.description ? (
                    <p className="relative mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
                      {skill.description}
                    </p>
                  ) : null}

                  <div className="relative mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line)]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${tone.base}, ${tone.soft})` }}
                        initial={{ width: "0%" }}
                        whileInView={{ width: `${level}%` }}
                        viewport={{ once: true, margin: "-8%" }}
                        transition={{ duration: 1, delay: 0.2 + Math.min(index * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[0.48rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-dashed border-[var(--line-strong)] p-10 text-center">
            <p className="font-display text-3xl italic text-[var(--foreground)]">The toolkit is being assembled.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Skills added through the admin dashboard will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
