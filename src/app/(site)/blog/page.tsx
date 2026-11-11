import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts, getSiteSettings } from "@/lib/data";
import { BlogArchive } from "@/components/site/blog-archive";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Journal",
    description: settings.sectionCopy.blog.description,
    alternates: { canonical: "/blog" },
    openGraph: {
      title: `Journal — ${settings.siteName}`,
      description: settings.sectionCopy.blog.description,
      url: absoluteUrl("/blog"),
    },
  };
}

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSiteSettings()]);

  return (
    <div className="relative pb-24 pt-[calc(74px+5rem)]">
      <div className="frame">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span>Journal / Notes</span>
          <span>{String(posts.length).padStart(2, "0")} entries</span>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">{settings.sectionCopy.blog.eyebrow}</p>
            <h1 className="display-title mt-5 text-[clamp(3.1rem,7.4vw,6.4rem)]">
              Notes from <span className="italic text-[var(--accent-soft)]">the build.</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)] lg:ml-auto">
              {settings.sectionCopy.blog.description}
            </p>
          </div>
        </div>

        {posts.length > 0 ? (
          <BlogArchive posts={posts} />
        ) : (
          <div className="mt-14 rounded-xl border border-dashed border-[var(--line-strong)] p-16 text-center">
            <p className="font-display text-4xl italic">The first entry is on its way.</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
              Notes, learning logs, and technical writing published from the dashboard will gather here.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/#projects" className="btn-primary"><span>View projects</span></Link>
              <Link href="/#contact" className="btn-ghost">Say hello <ArrowUpRight size={13} /></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
