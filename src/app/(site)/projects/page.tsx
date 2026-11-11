import type { Metadata } from "next";
import { getProjects, getSiteSettings } from "@/lib/data";
import { ProjectsArchive } from "@/components/site/projects-archive";
import { absoluteUrl } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Selected work",
    description: settings.sectionCopy.projects.description,
    alternates: { canonical: "/projects" },
    openGraph: {
      title: `Selected work — ${settings.siteName}`,
      description: settings.sectionCopy.projects.description,
      url: absoluteUrl("/projects"),
    },
  };
}

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSiteSettings()]);

  return (
    <div className="relative pb-24 pt-[calc(74px+5rem)]">
      <div className="frame">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5 text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span>Archive / {new Date().getFullYear()}</span>
          <span>{String(projects.length).padStart(2, "0")} projects</span>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow">{settings.sectionCopy.projects.eyebrow}</p>
            <h1 className="display-title mt-5 text-[clamp(3.1rem,7.4vw,6.4rem)]">
              Selected <span className="italic text-[var(--accent-soft)]">work.</span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)] lg:ml-auto">
              {settings.sectionCopy.projects.description}
            </p>
          </div>
        </div>

        {projects.length > 0 ? (
          <ProjectsArchive projects={projects} />
        ) : (
          <div className="mt-14 rounded-xl border border-dashed border-[var(--line-strong)] p-16 text-center">
            <p className="font-display text-4xl italic">The archive is being assembled.</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
              Published projects will appear here. In the meantime, say hello or explore the journal.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/#contact" className="btn-primary"><span>Start a conversation</span></Link>
              <Link href="/blog" className="btn-ghost">Journal <ArrowUpRight size={13} /></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
