"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
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

export function ProjectsArchive({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category).filter(Boolean))),
    [projects]
  );
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = projects.filter((project) => {
    const inCategory = active === "All" || project.category === active;
    const inQuery =
      !query ||
      `${project.title} ${project.summary} ${project.techStack.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return inCategory && inQuery;
  });

  return (
    <div className="mt-12">
      <div className="flex flex-col gap-4 border-y border-[var(--line)] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "relative shrink-0 rounded-full px-3.5 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] transition-colors",
                active === category ? "text-[var(--background)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              {active === category && (
                <motion.span
                  layoutId="archive-tab"
                  className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              className="field !w-[210px] !py-2.5 !pl-8 !text-xs"
              aria-label="Search projects"
            />
          </div>
          <span className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.15em] text-[var(--muted)]">
            <SlidersHorizontal size={11} /> {filtered.length}
          </span>
        </div>
      </div>

      <motion.div layout className="mt-5 grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <motion.article
              layout
              key={project.slug}
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.2) }}
              className="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)]"
            >
              <Link href={`/projects/${project.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-rgb),0.2),transparent_60%),linear-gradient(140deg,var(--surface),var(--background))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.15em] text-white/75 backdrop-blur-md">
                    {project.category}
                  </span>
                  <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/20 text-white opacity-0 backdrop-blur-md transition-all duration-400 group-hover:opacity-100">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[0.55rem] uppercase tracking-[0.17em] text-[var(--muted)]">{project.year}</p>
                    <span className="h-px flex-1 bg-[var(--line)]" />
                  </div>
                  <h2 className="mt-3 font-display text-3xl leading-tight transition-colors group-hover:text-[var(--accent-soft)]">
                    {project.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-[var(--line-strong)] p-12 text-center">
          <p className="font-display text-3xl italic">No projects match this view.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Try a different category or search term.</p>
          <button
            type="button"
            onClick={() => {
              setActive("All");
              setQuery("");
            }}
            className="mt-5 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--accent)] underline underline-offset-4"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
