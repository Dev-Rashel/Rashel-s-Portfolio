"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Clock, Search } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

type Post = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  publishedAt: string | Date | null;
  readingTime: number;
};

export function BlogArchive({ posts }: { posts: Post[] }) {
  const categories = useMemo(() => Array.from(new Set(posts.map((post) => post.category).filter(Boolean))), [posts]);
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = posts.filter((post) => {
    const categoryMatch = active === "All" || post.category === active;
    const queryMatch =
      !query || `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
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
                  layoutId="blog-tab"
                  className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the journal"
            className="field !w-[230px] !py-2.5 !pl-8 !text-xs"
            aria-label="Search journal"
          />
        </div>
      </div>

      <motion.div layout className="mt-5 grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((post, index) => (
            <motion.article
              layout
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.2) }}
              className="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)]"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-rgb),0.2),transparent_60%),linear-gradient(140deg,var(--surface),var(--background))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.15em] text-white/75 backdrop-blur-md">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between text-[0.53rem] uppercase tracking-[0.15em] text-[var(--muted)]">
                    <span>{formatDate(post.publishedAt, { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={9} /> {post.readingTime} min
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-[clamp(1.4rem,2vw,1.8rem)] leading-tight transition-colors group-hover:text-[var(--accent-soft)]">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <ArrowUpRight size={14} className="text-[var(--muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-[var(--line-strong)] p-12 text-center">
          <p className="font-display text-3xl italic">No notes found.</p>
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
