import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";
import { getPostBySlug, getProfile, getRelatedPosts, getSiteSettings } from "@/lib/data";
import { ReadingProgress } from "@/components/site/reading-progress";
import { ShareButton } from "@/components/site/share-button";
import { Reveal } from "@/components/site/reveal";
import { absoluteUrl, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const description = post.seoDescription || post.excerpt;
  return {
    title: post.seoTitle || post.title,
    description,
    keywords: post.seoKeywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, profile, settings] = await Promise.all([
    getRelatedPosts(post.slug, post.category),
    getProfile(),
    getSiteSettings(),
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    author: { "@type": "Person", name: profile.fullName },
    publisher: { "@type": "Person", name: settings.siteName },
  };

  return (
    <article className="relative pb-24 pt-[calc(74px+3rem)]">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <div className="frame">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" />
          All notes
        </Link>

        <header className="mx-auto mt-10 max-w-5xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 text-[0.58rem] uppercase tracking-[0.18em] text-[var(--muted)]">
            <span className="text-[var(--accent)]">{post.category}</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><Clock size={10} /> {post.readingTime} min read</span>
          </div>
          <h1 className="display-title mx-auto mt-6 max-w-4xl text-[clamp(2.3rem,4.8vw,4.2rem)]">{post.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">{post.excerpt}</p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.14em] text-[var(--muted)]">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line)] font-display text-xs text-[var(--accent)]">
                {profile.fullName.slice(0, 1)}
              </span>
              {profile.fullName}
            </span>
            <span className="h-4 w-px bg-[var(--line)]" />
            <ShareButton title={post.title} />
          </div>
        </header>

        {post.coverImage && (
          <Reveal className="mt-12">
            <div className="relative aspect-[16/8] overflow-hidden rounded-xl border border-[var(--line)]">
              <Image src={post.coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </Reveal>
        )}

        <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[1fr_220px]">
          <div>
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.gallery.length > 0 && (
              <div className="mt-12 grid gap-3 sm:grid-cols-2">
                {post.gallery.map((image, index) => (
                  <div key={image} className="aspect-[4/3] overflow-hidden rounded-lg border border-[var(--line)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`${post.title} gallery ${index + 1}`} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-6">
              <span className="mr-1 text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)]">Filed under</span>
              {post.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-xl border border-[var(--line)] p-5 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-[var(--line)] font-display text-lg text-[var(--accent)]">
                  {profile.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.profileImage} alt={profile.fullName} className="h-full w-full object-cover" />
                  ) : (
                    profile.fullName.slice(0, 1)
                  )}
                </span>
                <p className="mt-3 text-sm font-medium">{profile.fullName}</p>
                <p className="mt-1 text-[0.55rem] uppercase tracking-[0.14em] text-[var(--muted)]">{profile.designation}</p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">{profile.shortBio}</p>
              </div>
              <div className="rounded-xl border border-[var(--line)] p-5">
                <p className="text-[0.54rem] uppercase tracking-[0.18em] text-[var(--muted)]">Continue reading</p>
                <div className="mt-4 space-y-3">
                  {related.slice(0, 2).map((item) => (
                    <Link key={item.slug} href={`/blog/${item.slug}`} className="group block border-t border-[var(--line)] pt-3">
                      <p className="text-xs leading-snug text-[var(--foreground-soft)] transition-colors group-hover:text-[var(--accent)]">{item.title}</p>
                      <span className="mt-1 block text-[0.5rem] uppercase tracking-[0.14em] text-[var(--muted)]">{formatDate(item.publishedAt, { month: "short", year: "numeric" })}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-[var(--line)] pt-10">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.5rem)]">More from the journal</h2>
              <Link href="/blog" className="hidden items-center gap-2 text-[0.6rem] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-[var(--accent)] sm:flex">
                All notes <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="group rounded-xl border border-[var(--line)] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--line-strong)]">
                  <span className="text-[0.52rem] uppercase tracking-[0.15em] text-[var(--accent)]">{item.category}</span>
                  <h3 className="mt-3 font-display text-2xl leading-tight transition-colors group-hover:text-[var(--accent-soft)]">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">{item.excerpt}</p>
                  <span className="mt-4 flex items-center gap-1.5 text-[0.52rem] uppercase tracking-[0.14em] text-[var(--muted)]">
                    Read <ArrowUpRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
