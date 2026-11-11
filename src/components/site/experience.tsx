"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Briefcase, ExternalLink, GraduationCap, MapPin } from "lucide-react";
import type { SectionCopy } from "@/lib/models/SiteSettings";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { formatDate, cn } from "@/lib/utils";

type ExperienceItem = {
  _id?: string;
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
};

type EducationItem = {
  _id?: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  grade: string;
  description: string;
};

type CertificationItem = {
  _id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  description: string;
  skills: string[];
};

export function Experience({
  experiences,
  education,
  certifications,
  copy,
}: {
  experiences: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  copy: SectionCopy;
}) {
  const [tab, setTab] = useState<"experience" | "education">(
    experiences.length > 0 ? "experience" : "education"
  );

  return (
    <section
      id="experience"
      className="section-shell relative border-t border-[var(--line)] bg-[var(--background-elevated)]"
    >
      <div className="frame">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} index="04" />

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="flex flex-col gap-2">
                <TabButton
                  active={tab === "experience"}
                  onClick={() => setTab("experience")}
                  icon={<Briefcase size={14} />}
                  label="Experience"
                  count={experiences.length}
                />
                <TabButton
                  active={tab === "education"}
                  onClick={() => setTab("education")}
                  icon={<GraduationCap size={15} />}
                  label="Education"
                  count={education.length}
                />
              </div>

              <div className="mt-8 hidden rounded-xl border border-[var(--line)] p-5 lg:block">
                <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">Currently</p>
                <p className="mt-3 font-display text-2xl italic text-[var(--accent-soft)]">
                  {experiences.find((item) => item.current)?.role || "Building & learning"}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {experiences.find((item) => item.current)?.company || "Open to the next opportunity"}
                </p>
                <span className="mt-4 block h-px w-full bg-[var(--line)]" />
                <p className="mt-4 text-[0.58rem] uppercase tracking-[0.17em] text-[var(--muted)]">
                  A timeline of deliberate steps.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {tab === "experience" ? (
                  experiences.length > 0 ? (
                    <div className="relative">
                      <div className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-[var(--accent)] via-[var(--line-strong)] to-transparent sm:left-[9px]" />
                      <div className="space-y-10">
                        {experiences.map((item, index) => (
                          <motion.article
                            key={item._id || item.role + index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, delay: index * 0.06 }}
                            className="relative pl-8 sm:pl-12"
                          >
                            <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full border border-[var(--accent)] bg-[var(--background-elevated)] sm:h-5 sm:w-5">
                              <span className={cn("h-1.5 w-1.5 rounded-full", item.current ? "bg-[var(--accent)]" : "bg-[var(--muted)]")} />
                            </span>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-[0.57rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                                  {formatDate(item.startDate, { day: undefined, month: "short" })} —{" "}
                                  {item.current ? "Present" : item.endDate ? formatDate(item.endDate, { day: undefined, month: "short" }) : "—"}
                                </p>
                                <h3 className="mt-2 font-display text-[clamp(1.35rem,2vw,1.9rem)] leading-tight">{item.role}</h3>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.66rem] uppercase tracking-[0.12em] text-[var(--muted)]">
                                  <span>{item.companyUrl ? <a href={item.companyUrl} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-[var(--foreground)]">{item.company}</a> : item.company}</span>
                                  {item.type && <span>· {item.type}</span>}
                                  {item.location && (
                                    <span className="flex items-center gap-1">
                                      · <MapPin size={10} /> {item.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {item.current && (
                                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.16em] text-emerald-300">
                                  Now
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
                            )}
                            {item.highlights?.length > 0 && (
                              <ul className="mt-4 space-y-1.5">
                                {item.highlights.map((highlight) => (
                                  <li key={highlight} className="flex gap-2 text-[0.82rem] leading-relaxed text-[var(--foreground-soft)]">
                                    <span className="mt-[0.52rem] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </motion.article>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <EmptyTimeline label="Experience entries added in the dashboard will build this timeline." />
                  )
                ) : education.length > 0 ? (
                  <div className="space-y-4">
                    {education.map((item, index) => (
                      <motion.article
                        key={item._id || item.institution + index}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.06 }}
                        className="group rounded-xl border border-[var(--line)] bg-[var(--card)] p-5 transition-colors hover:border-[var(--line-strong)] sm:p-6"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-[0.57rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                              {formatDate(item.startDate, { day: undefined, month: "short" })} —{" "}
                              {item.current ? "Present" : item.endDate ? formatDate(item.endDate, { day: undefined, month: "short" }) : "—"}
                            </p>
                            <h3 className="mt-2 font-display text-2xl leading-tight">{item.degree}</h3>
                            <p className="mt-1 text-sm text-[var(--foreground-soft)]">{item.institution}</p>
                            {item.field && <p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">{item.field}</p>}
                          </div>
                          {item.grade && (
                            <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em] text-[var(--foreground-soft)]">
                              {item.grade}
                            </span>
                          )}
                        </div>
                        {item.description && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>}
                        {item.location && (
                          <p className="mt-3 flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                            <MapPin size={10} /> {item.location}
                          </p>
                        )}
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <EmptyTimeline label="Education entries added in the dashboard will appear here." />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {certifications.length > 0 && (
          <div className="mt-20 border-t border-[var(--line)] pt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Credentials</p>
                <h3 className="mt-3 font-display text-[clamp(1.7rem,2.5vw,2.3rem)]">Certifications & training</h3>
              </div>
              <Award className="hidden text-[var(--accent)] sm:block" size={24} strokeWidth={1.2} />
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((certification, index) => (
                <Reveal key={certification._id || certification.title} delay={index * 0.05}>
                  <div className="group flex h-full flex-col justify-between rounded-xl border border-[var(--line)] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/40">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <Award size={16} className="mt-1 text-[var(--accent)]" />
                        <span className="text-[0.55rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                          {formatDate(certification.issueDate, { day: undefined, month: "short" })}
                        </span>
                      </div>
                      <h4 className="mt-5 text-base font-semibold leading-snug text-[var(--foreground)]">{certification.title}</h4>
                      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--muted)]">{certification.issuer}</p>
                      {certification.description && <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">{certification.description}</p>}
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1">
                        {certification.skills.slice(0, 2).map((skill) => (
                          <span key={skill} className="tag !px-2 !py-0.5 !text-[0.5rem]">{skill}</span>
                        ))}
                      </div>
                      {certification.credentialUrl && (
                        <a href={certification.credentialUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${certification.title} credential`} className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between rounded-lg border px-4 py-3.5 text-left transition-all duration-300",
        active
          ? "border-[var(--accent)]/35 bg-[var(--card)] text-[var(--foreground)]"
          : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:text-[var(--foreground)]"
      )}
    >
      <span className="flex items-center gap-3">
        <span className={cn("transition-colors", active ? "text-[var(--accent)]" : "text-[var(--muted)]")}>{icon}</span>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </span>
      <span className="font-display text-lg tabular-nums opacity-50">{String(count).padStart(2, "0")}</span>
    </button>
  );
}

function EmptyTimeline({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--line-strong)] p-10 text-center">
      <p className="font-display text-3xl italic">A chapter waiting to be written.</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}
