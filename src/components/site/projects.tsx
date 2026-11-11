"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Layers3 } from "lucide-react";
import type { SectionCopy } from "@/lib/models/SiteSettings";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

type Project = {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  category: string;
  year: string;
  techStack: string[];
  featured?: boolean;
};

export function Projects({ projects, copy }: { projects: Project[]; copy: SectionCopy }) {
  const featured = projects.filter((project) => project.featured).slice(0, 3);
  const display = featured.length > 0 ? featured : projects.slice(0, 3);
  const remaining = projects.filter((project) => !display.some((item) => item.slug === project.slug)).slice(0, 5);

  return (
    <section id="projects" className="section-shell relative border-t border-[var(--line)]">
      <div className="frame">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} index="03" />

        {projects.length === 0 ? (
          <Reveal className="mt-14">
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-[var(--line-strong)] px-6 py-20 text-center">
              <span className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(var(--accent-rgb),0.08)] blur-[80px]" />
              <p className="font-display text-4xl italic">The next project is taking shape.</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
                Projects published from the admin dashboard will appear here, each with its own cinematic case study.
              </p>
            </div>
          </Reveal>
        ) : (
          <>
            <div className="mt-14 grid auto-rows-[minmax(0,1fr)] gap-4 lg:grid-cols-12">
              {display.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} featured={index === 0} />
              ))}
            </div>

            {remaining.length > 0 && <ProjectIndex projects={remaining} />}

            <Reveal delay={0.05}>
              <div className="mt-10 flex items-center justify-between border-t border-[var(--line)] pt-6">
                <span className="text-[0.6rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {projects.length} selected {projects.length === 1 ? "project" : "projects"}
                </span>
                <Link
                  href="/projects"
                  className="group flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]"
                >
                  All projects
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[#080b11]">
                    <ArrowUpRight size={13} />
                  </span>
                </Link>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[1.1rem] border border-[var(--line)] bg-[var(--surface)]",
        featured ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"
      )}
    >
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <div className={cn("relative overflow-hidden", featured ? "aspect-[16/12] lg:aspect-[16/14]" : "aspect-[16/8]")}>
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 42vw"}
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(var(--accent-rgb),0.22),transparent_60%),linear-gradient(140deg,var(--surface),var(--background))]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[0.52rem] uppercase tracking-[0.15em] text-white/75 backdrop-blur-md">
              {project.category}
            </span>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.2em] text-white/55">{project.year || "Selected work"}</p>
              <h3
                className={cn(
                  "mt-1.5 font-display leading-[1.02] text-white",
                  featured ? "text-[clamp(1.7rem,2.8vw,2.6rem)]" : "text-[clamp(1.5rem,2.4vw,2.1rem)]"
                )}
              >
                {project.title}
              </h3>
            </div>
            <span className="grid h-10 w-10 shrink-0 translate-y-2 place-items-center rounded-full border border-white/20 bg-white/10 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
        {featured && (
          <div className="hidden gap-5 p-5 sm:grid sm:grid-cols-[1fr_auto]">
            <p className="max-w-lg text-sm leading-relaxed text-[var(--muted)]">{project.summary}</p>
            <div className="flex flex-wrap items-start justify-end gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          </div>
        )}
      </Link>
    </motion.article>
  );
}

function ProjectIndex({ projects }: { projects: Project[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });

  const onMove = (event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      className="relative mt-4 border-t border-[var(--line)]"
      onMouseMove={onMove}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex items-center gap-2 py-4 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">
        <Layers3 size={11} /> More selected work
      </div>
      {projects.map((project, index) => (
        <Link
          key={project.slug}
          href={`/projects/${project.slug}`}
          onMouseEnter={() => setHovered(project)}
          className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-[var(--line)] py-5 transition-colors hover:bg-[var(--card)] sm:grid-cols-[50px_1fr_1fr_auto] sm:gap-6"
         
        >
          <span className="text-[0.55rem] tabular-nums text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-[clamp(1.3rem,2.2vw,1.9rem)] leading-none transition-transform duration-500 group-hover:translate-x-2">
            {project.title}
          </h3>
          <span className="hidden text-[0.62rem] uppercase tracking-[0.14em] text-[var(--muted)] sm:block">{project.category}</span>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
            <ArrowUpRight size={13} />
          </span>
        </Link>
      ))}

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-44 w-64 overflow-hidden rounded-lg border border-white/10 shadow-2xl md:block"
            style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.3 }}
          >
            {hovered.thumbnail ? (
              <Image src={hovered.thumbnail} alt={hovered.title} fill sizes="256px" className="object-cover" />
            ) : (
              <div className="h-full w-full bg-[var(--surface)]" />
            )}
            <div className="absolute inset-0 bg-black/15" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
