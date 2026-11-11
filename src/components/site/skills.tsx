"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
};

export function Skills({ skills, copy }: { skills: Skill[]; copy: SectionCopy }) {
  return (
    <section id="skills" className="section-shell relative border-t border-[var(--line)] bg-[var(--background-elevated)]">
      <div className="frame relative">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} index="02" />

        {skills.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-2 sm:gap-x-14">
            {skills.map((skill, index) => (
              <motion.div
                key={skill._id || skill.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.025, 0.25) }}
                className="flex items-center gap-3.5 border-b border-[var(--line)] py-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--line)] bg-[var(--background)] text-[var(--foreground-soft)]">
                  {skill.image ? (
                    <Image
                      src={skill.image}
                      alt=""
                      width={20}
                      height={20}
                      unoptimized
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <SkillIcon name={skill.icon} size={15} />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.95rem] text-[var(--foreground)]">
                  {skill.name}
                </span>
                <span className="shrink-0 font-display text-lg tabular-nums leading-none text-[var(--muted)]">
                  {skill.level}%
                </span>
              </motion.div>
            ))}
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
