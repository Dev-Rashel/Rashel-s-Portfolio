"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  Award,
  Briefcase,
  Database,
  FileText,
  FolderKanban,
  GraduationCap,
  ImageIcon,
  Inbox,
  Layers3,
  Mail,
  PenLine,
  Plus,
  RefreshCw,
  Tags,
  Trophy,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { AdminButton, PageHeader, Panel, SkeletonRows, StatusBadge } from "./ui";

type Stats = {
  counts: {
    skills: number;
    projects: number;
    publishedProjects: number;
    posts: number;
    publishedPosts: number;
    drafts: number;
    messages: number;
    unread: number;
    archived: number;
    media: number;
    activities: number;
    certifications: number;
    experiences: number;
    education: number;
    achievements: number;
    categories: number;
  };
  recentMessages: Array<{ _id: string; name: string; email: string; subject: string; createdAt: string; read: boolean }>;
  recentPosts: Array<{ _id: string; title: string; slug: string; published: boolean; draft: boolean; category: string; createdAt: string }>;
  recentProjects: Array<{ _id: string; title: string; slug: string; published: boolean; featured: boolean; category: string; createdAt: string }>;
  timeline: Array<{ month: string; published: number }>;
};

export function Overview() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/stats", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not load dashboard data.");
      setStats(body.data as Stats);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div>
        <PageHeader eyebrow="Workspace" title="Overview" description="A living pulse of your portfolio." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-white/8 bg-white/[0.018] px-5 py-5">
              <div className="h-8 w-16 animate-pulse rounded bg-white/5" />
              <div className="mt-3 h-2.5 w-24 animate-pulse rounded bg-white/[0.03]" />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel><SkeletonRows rows={5} /></Panel>
          <Panel><SkeletonRows rows={5} /></Panel>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <PageHeader eyebrow="Workspace" title="Overview" description="A living pulse of your portfolio." />
        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-6 sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-amber-300">
            <Database size={18} />
          </div>
          <h3 className="mt-5 font-display text-3xl text-white/90">The database is not connected yet.</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/40">
            {error || "Add your MongoDB connection string and restart the server."} The dashboard is ready — it just needs
            a database and your first administrator account.
          </p>
          <div className="mt-5 space-y-2 rounded-xl border border-white/8 bg-black/25 p-4 font-mono text-[0.68rem] text-white/50">
            <p>
              <span className="text-[#b794f6]">MONGODB_URI</span>=mongodb+srv://…
            </p>
            <p>
              <span className="text-[#b794f6]">AUTH_SECRET</span>=a-long-random-string
            </p>
            <p>
              <span className="text-[#b794f6]">ADMIN_EMAIL</span>=you@example.com
            </p>
            <p>
              <span className="text-[#b794f6]">ADMIN_PASSWORD</span>=a-strong-password
            </p>
          </div>
          <p className="mt-3 text-xs text-white/30">
            Then run <span className="font-mono text-white/60">npm run seed</span> to create the administrator and starter
            content.
          </p>
          <AdminButton variant="ghost" className="mt-5" onClick={() => void load()}>
            <RefreshCw size={12} /> Try again
          </AdminButton>
        </div>
      </div>
    );
  }

  const { counts } = stats;
  const totalPublished = counts.publishedProjects + counts.publishedPosts;
  const maxTimeline = Math.max(1, ...stats.timeline.map((entry) => entry.published));

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="A quiet pulse."
        description="Everything happening across your portfolio, in one considered view."
        actions={
          <>
            <AdminButton variant="ghost" onClick={() => void load()}>
              <RefreshCw size={12} /> Refresh
            </AdminButton>
            <Link href="/" target="_blank">
              <AdminButton variant="soft">
                View live site <ArrowUpRight size={12} />
              </AdminButton>
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          href="/admin/dashboard/projects"
          icon={<FolderKanban size={16} />}
          label="Projects"
          value={counts.projects}
          detail={`${counts.publishedProjects} published · ${counts.projects - counts.publishedProjects} in draft`}
        />
        <StatCard
          href="/admin/dashboard/blog"
          icon={<FileText size={16} />}
          label="Journal entries"
          value={counts.posts}
          detail={`${counts.publishedPosts} live · ${counts.drafts} drafts`}
        />
        <StatCard
          href="/admin/dashboard/messages"
          icon={<Inbox size={16} />}
          label="Messages"
          value={counts.messages}
          detail={`${counts.unread} unread · ${counts.archived} archived`}
          accent={counts.unread > 0}
        />
        <StatCard
          href="/admin/dashboard/media"
          icon={<ImageIcon size={16} />}
          label="Media assets"
          value={counts.media}
          detail="Images and documents"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Panel
          className="lg:col-span-7"
          title="Recent messages"
          description="The conversations that started from your contact form."
          actions={
            <Link href="/admin/dashboard/messages" className="text-[0.52rem] uppercase tracking-[0.14em] text-[#b794f6] hover:text-[#eadcff]">
              Open inbox
            </Link>
          }
        >
          {stats.recentMessages.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-12 text-center">
              <Mail size={20} className="text-white/15" />
              <p className="mt-3 text-xs text-white/35">No messages yet. Your inbox is quiet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recentMessages.map((message) => (
                <Link
                  key={message._id}
                  href="/admin/dashboard/messages"
                  className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      message.read ? "bg-white/15" : "bg-[#b794f6]"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-[0.72rem] text-white/80">{message.subject}</p>
                      <span className="shrink-0 text-[0.5rem] uppercase tracking-[0.1em] text-white/25">
                        {formatDate(message.createdAt, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[0.6rem] text-white/30">
                      {message.name} · {message.email}
                    </p>
                  </div>
                  {!message.read && <StatusBadge tone="accent">New</StatusBadge>}
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel className="lg:col-span-5" title="Publishing rhythm" description="Published journal entries over the last six months.">
          <div className="px-5 py-5">
            <div className="flex h-36 items-end gap-2">
              {stats.timeline.map((entry) => (
                <div key={entry.month} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-28 w-full items-end">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-[#b794f6]/25 to-[#b794f6] transition-all"
                      style={{ height: `${Math.max(4, (entry.published / maxTimeline) * 100)}%` }}
                      title={`${entry.published} published`}
                    />
                  </div>
                  <span className="text-[0.46rem] uppercase tracking-[0.08em] text-white/25">
                    {new Date(`${entry.month}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/7 pt-3">
              <p className="text-[0.52rem] uppercase tracking-[0.12em] text-white/25">{totalPublished} public pieces</p>
              <p className="text-[0.52rem] uppercase tracking-[0.12em] text-[#b794f6]">
                {counts.drafts > 0 ? `${counts.drafts} in progress` : "All published"}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Latest writing"
          description="The newest entries in your journal."
          actions={
            <Link href="/admin/dashboard/blog" className="text-[0.52rem] uppercase tracking-[0.14em] text-[#b794f6] hover:text-[#eadcff]">
              Manage
            </Link>
          }
        >
          {stats.recentPosts.length === 0 ? (
            <EmptyLine text="No journal entries yet." href="/admin/dashboard/blog" label="Write the first entry" />
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recentPosts.map((post) => (
                <Link
                  key={post._id}
                  href="/admin/dashboard/blog"
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.7rem] text-white/75">{post.title}</p>
                    <p className="mt-0.5 text-[0.52rem] uppercase tracking-[0.1em] text-white/25">{post.category}</p>
                  </div>
                  <StatusBadge tone={post.published && !post.draft ? "success" : "warning"}>
                    {post.published && !post.draft ? "Live" : "Draft"}
                  </StatusBadge>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Recent projects"
          description="The latest case studies added to your portfolio."
          actions={
            <Link href="/admin/dashboard/projects" className="text-[0.52rem] uppercase tracking-[0.14em] text-[#b794f6] hover:text-[#eadcff]">
              Manage
            </Link>
          }
        >
          {stats.recentProjects.length === 0 ? (
            <EmptyLine text="No projects yet." href="/admin/dashboard/projects" label="Add the first project" />
          ) : (
            <div className="divide-y divide-white/5">
              {stats.recentProjects.map((project) => (
                <Link
                  key={project._id}
                  href="/admin/dashboard/projects"
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.7rem] text-white/75">{project.title}</p>
                    <p className="mt-0.5 text-[0.52rem] uppercase tracking-[0.1em] text-white/25">{project.category}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {project.featured && <StatusBadge tone="accent">Featured</StatusBadge>}
                    <StatusBadge tone={project.published ? "success" : "warning"}>
                      {project.published ? "Live" : "Draft"}
                    </StatusBadge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-8" title="Library at a glance" description="The supporting content behind the story.">
          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4">
            <MiniStat icon={<Layers3 size={13} />} label="Skills" value={counts.skills} href="/admin/dashboard/skills" />
            <MiniStat icon={<Briefcase size={13} />} label="Experience" value={counts.experiences} href="/admin/dashboard/experience" />
            <MiniStat icon={<GraduationCap size={13} />} label="Education" value={counts.education} href="/admin/dashboard/education" />
            <MiniStat icon={<Award size={13} />} label="Certificates" value={counts.certifications} href="/admin/dashboard/certifications" />
            <MiniStat icon={<Activity size={13} />} label="Activities" value={counts.activities} href="/admin/dashboard/activities" />
            <MiniStat icon={<Trophy size={13} />} label="Achievements" value={counts.achievements} href="/admin/dashboard/achievements" />
            <MiniStat icon={<Tags size={13} />} label="Categories" value={counts.categories} href="/admin/dashboard/categories" />
            <MiniStat icon={<ImageIcon size={13} />} label="Media" value={counts.media} href="/admin/dashboard/media" />
          </div>
        </Panel>

        <Panel className="lg:col-span-4" title="Quick actions" description="Jump straight into the work.">
          <div className="space-y-1 px-3 py-3">
            <QuickAction href="/admin/dashboard/projects" icon={<Plus size={12} />} label="Add a project" />
            <QuickAction href="/admin/dashboard/blog" icon={<PenLine size={12} />} label="Write a journal entry" />
            <QuickAction href="/admin/dashboard/media" icon={<ImageIcon size={12} />} label="Upload media" />
            <QuickAction href="/admin/dashboard/skills" icon={<Layers3 size={12} />} label="Update skills" />
            <QuickAction href="/admin/dashboard/settings" icon={<Database size={12} />} label="Edit website settings" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StatCard({
  href,
  icon,
  label,
  value,
  detail,
  accent,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white/[0.018] px-5 py-5 transition-all hover:bg-white/[0.035]",
        accent ? "border-[#b794f6]/20" : "border-white/8 hover:border-white/15"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/8 bg-white/[0.03] text-white/40 transition-colors group-hover:text-[#b794f6]">
          {icon}
        </span>
        <ArrowUpRight size={13} className="text-white/15 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b794f6]" />
      </div>
      <p className="mt-4 font-display text-4xl leading-none text-[#f4f0fc]">{value}</p>
      <p className="mt-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className="mt-1 text-[0.58rem] text-white/25">{detail}</p>
    </Link>
  );
}

function MiniStat({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: number; href: string }) {
  return (
    <Link href={href} className="group bg-[#0b0817] px-4 py-4 transition-colors hover:bg-white/[0.03]">
      <div className="flex items-center gap-2 text-white/25 transition-colors group-hover:text-[#b794f6]">
        {icon}
        <span className="text-[0.5rem] font-bold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl text-white/75">{value}</p>
    </Link>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[0.68rem] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80"
    >
      <span className="grid h-6 w-6 place-items-center rounded-md border border-white/8 text-[#b794f6]">{icon}</span>
      <span className="flex-1">{label}</span>
      <ArrowUpRight size={11} className="text-white/20" />
    </Link>
  );
}

function EmptyLine({ text, href, label }: { text: string; href: string; label: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-xs text-white/30">{text}</p>
      <Link href={href} className="mt-2 inline-flex items-center gap-1 text-[0.55rem] uppercase tracking-[0.12em] text-[#b794f6]">
        {label} <ArrowUpRight size={10} />
      </Link>
    </div>
  );
}
