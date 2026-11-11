import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github, Globe2, Layers3 } from "lucide-react";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/lib/data";
import { ClipImage } from "@/components/site/parallax-image";
import { Reveal } from "@/components/site/reveal";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!project) return { title: "Project not found" };
  const description = project.seoDescription || project.summary;
  return {
    title: project.seoTitle || project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.seoTitle || project.title,
      description,
      url: absoluteUrl(`/projects/${project.slug}`),
      images: project.thumbnail ? [{ url: project.thumbnail }] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
    other: { "site-name": settings.siteName },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const currentIndex = allProjects.findIndex((item) => item.slug === project.slug);
  const next = allProjects[currentIndex + 1] || allProjects[0];
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.thumbnail,
    dateCreated: project.year,
    keywords: project.techStack.join(", "),
  };

  return (
    <article className="relative pb-24 pt-[calc(74px+3rem)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />
      <div className="frame">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" />
          All projects
        </Link>

        <header className="mt-9 grid gap-8 border-b border-[var(--line)] pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3 text-[0.57rem] uppercase tracking-[0.18em] text-[var(--muted)]">
              <span className="text-[var(--accent)]">{project.category}</span>
              <span>·</span>
              <span>{project.year}</span>
              <span>·</span>
              <span>{project.role}</span>
            </div>
            <h1 className="display-title mt-5 text-[clamp(2.9rem,6.4vw,5.8rem)]">{project.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">{project.summary}</p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:items-end">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                <Globe2 size={14} />
                <span>Visit live site</span>
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost group">
                <Github size={14} />
                <span>View source</span>
                <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </header>

        <div className="mt-8">
          <ClipImage
            src={project.thumbnail}
            alt={project.title}
            className="aspect-[16/9] w-full rounded-xl border border-[var(--line)]"
            sizes="100vw"
            priority
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: project.content }} />
            </Reveal>

            {project.features.length > 0 && (
              <Reveal>
                <div className="mt-14 rounded-xl border border-[var(--line)] p-6 sm:p-8">
                  <p className="eyebrow">Capabilities</p>
                  <h2 className="mt-3 font-display text-3xl">What the product does</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <div key={feature} className="flex gap-3 border-t border-[var(--line)] pt-3 text-sm text-[var(--foreground-soft)]">
                        <span className="text-[0.55rem] tabular-nums text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {project.challenges && (
              <Reveal>
                <div className="mt-8 border-l border-[var(--accent)] pl-5 sm:pl-7">
                  <p className="eyebrow">The challenge</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{project.challenges}</p>
                </div>
              </Reveal>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <div className="rounded-xl border border-[var(--line)] p-5">
                <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">Technology</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--line)] pt-5">
                  <div>
                    <p className="text-[0.52rem] uppercase tracking-[0.16em] text-[var(--muted)]">Role</p>
                    <p className="mt-1.5 text-sm text-[var(--foreground-soft)]">{project.role || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[0.52rem] uppercase tracking-[0.16em] text-[var(--muted)]">Year</p>
                    <p className="mt-1.5 text-sm text-[var(--foreground-soft)]">{project.year || "—"}</p>
                  </div>
                </div>
              </div>

              {project.gallery.length > 0 && (
                <div>
                  <p className="mb-3 flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                    <Layers3 size={11} /> Gallery
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {project.gallery.map((image, index) => (
                      <Reveal key={image} delay={index * 0.05}>
                        <div className="aspect-square overflow-hidden rounded-lg border border-[var(--line)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`${project.title} detail ${index + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {next && next.slug !== project.slug && (
          <Link
            href={`/projects/${next.slug}`}
            className="group mt-20 flex items-center justify-between border-t border-[var(--line)] pt-8"
           
          >
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)]">Next project</p>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,3.2vw,3rem)] leading-none transition-colors group-hover:text-[var(--accent-soft)]">
                {next.title}
              </h2>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[#0b0817]">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
