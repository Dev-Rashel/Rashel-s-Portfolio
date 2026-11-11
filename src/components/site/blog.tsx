"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import type { SectionCopy } from "@/lib/models/SiteSettings";
import { SectionHeading } from "./section-heading";
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
  featured?: boolean;
};

export function Blog({ posts, copy }: { posts: Post[]; copy: SectionCopy }) {
  const [featured, ...rest] = posts;
  return (
    <section
      id="blog"
      className="section-shell relative border-t border-[var(--line)] bg-[var(--background-elevated)]"
    >
      <div className="frame">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} index="06" />

        {posts.length === 0 ? (
          <div className="mt-14 rounded-2xl border border-dashed border-[var(--line-strong)] p-12 text-center">
            <p className="font-display text-3xl italic">The first note is being written.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
              Published journal entries will gather here — technical notes, learning logs, and personal thoughts.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group mt-14 grid overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)] lg:grid-cols-12"
              >
                <Link href={`/blog/${featured.slug}`} className="relative block aspect-[16/10] overflow-hidden lg:col-span-6 lg:aspect-auto lg:min-h-[430px]">
                  {featured.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-rgb),0.2),transparent_60%),linear-gradient(140deg,var(--surface),var(--background))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[0.52rem] uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                    Featured note
                  </span>
                </Link>
                <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
                  <div>
                    <div className="flex items-center gap-3 text-[0.56rem] uppercase tracking-[0.17em] text-[var(--muted)]">
                      <span className="text-[var(--accent)]">{featured.category}</span>
                      <span>·</span>
                      <span>{formatDate(featured.publishedAt, { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <Link href={`/blog/${featured.slug}`}>
                      <h3 className="mt-4 font-display text-[clamp(1.7rem,2.8vw,2.7rem)] leading-[1.02] transition-colors group-hover:text-[var(--accent-soft)]">
                        {featured.title}
                      </h3>
                    </Link>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--muted)]">{featured.excerpt}</p>
                  </div>
                  <div className="mt-8 flex items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {featured.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="group/link grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#080b11]"
                      aria-label={`Read ${featured.title}`}
                    >
                      <ArrowUpRight size={16} className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            )}

            {rest.length > 0 && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {rest.slice(0, 2).map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: index * 0.08 }}
                    className={cn("group rounded-xl border border-[var(--line)] bg-[var(--card)] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--line-strong)] sm:p-7")}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[0.55rem] uppercase tracking-[0.16em] text-[var(--accent)]">{post.category}</span>
                      <span className="flex items-center gap-1.5 text-[0.52rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        <Clock size={9} /> {post.readingTime} min read
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="mt-4 font-display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.08] transition-colors group-hover:text-[var(--accent-soft)]">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                      <span className="text-[0.55rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                        {formatDate(post.publishedAt, { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <Link href={`/blog/${post.slug}`} className="flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.16em] text-[var(--foreground-soft)] transition-colors hover:text-[var(--accent)]">
                        Read <ArrowRight size={11} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link href="/blog" className="btn-ghost group">
                <span>Explore the journal</span>
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
