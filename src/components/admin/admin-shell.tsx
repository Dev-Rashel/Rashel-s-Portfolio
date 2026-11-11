"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  Layers3,
  Link2,
  LogOut,
  Mail,
  Menu,
  Palette,
  PanelBottom,
  Search,
  Settings,
  Sparkles,
  Tags,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Session = { name: string; email: string; role: string };

const navGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/dashboard/messages", label: "Messages", icon: Inbox, badge: true },
    ],
  },
  {
    label: "Identity",
    items: [
      { href: "/admin/dashboard/profile", label: "Profile", icon: CircleUserRound },
      { href: "/admin/dashboard/hero", label: "Hero section", icon: Sparkles },
      { href: "/admin/dashboard/about", label: "About", icon: FileText },
      { href: "/admin/dashboard/social-links", label: "Social links", icon: Link2 },
      { href: "/admin/dashboard/resume", label: "Résumé", icon: BookOpen },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/admin/dashboard/skills", label: "Skills", icon: Layers3 },
      { href: "/admin/dashboard/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/dashboard/blog", label: "Journal", icon: FileText },
      { href: "/admin/dashboard/categories", label: "Categories", icon: Tags },
      { href: "/admin/dashboard/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/dashboard/education", label: "Education", icon: GraduationCap },
      { href: "/admin/dashboard/certifications", label: "Certifications", icon: Award },
      { href: "/admin/dashboard/activities", label: "Activities", icon: Activity },
      { href: "/admin/dashboard/achievements", label: "Achievements", icon: Trophy },
    ],
  },
  {
    label: "Website",
    items: [
      { href: "/admin/dashboard/media", label: "Media library", icon: ImageIcon },
      { href: "/admin/dashboard/seo", label: "SEO", icon: Search },
      { href: "/admin/dashboard/navigation", label: "Navigation", icon: Menu },
      { href: "/admin/dashboard/footer", label: "Footer", icon: PanelBottom },
      { href: "/admin/dashboard/theme", label: "Theme", icon: Palette },
      { href: "/admin/dashboard/settings", label: "Website settings", icon: Settings },
    ],
  },
];

const titles: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": { title: "Overview", description: "A living pulse of your portfolio." },
  "/admin/dashboard/messages": { title: "Messages", description: "Every conversation that starts here." },
  "/admin/dashboard/profile": { title: "Profile", description: "The person behind the pixels." },
  "/admin/dashboard/hero": { title: "Hero section", description: "Craft the first impression." },
  "/admin/dashboard/about": { title: "About", description: "Tell the story with intention." },
  "/admin/dashboard/social-links": { title: "Social links", description: "Where the conversation continues." },
  "/admin/dashboard/resume": { title: "Résumé", description: "Keep your latest story ready to download." },
  "/admin/dashboard/skills": { title: "Skills", description: "The tools and disciplines in your toolkit." },
  "/admin/dashboard/projects": { title: "Projects", description: "Case studies, experiments, and shipped work." },
  "/admin/dashboard/blog": { title: "Journal", description: "Words, notes, and the learning in between." },
  "/admin/dashboard/categories": { title: "Categories", description: "A taxonomy for everything you publish." },
  "/admin/dashboard/experience": { title: "Experience", description: "The professional timeline." },
  "/admin/dashboard/education": { title: "Education", description: "The foundations of the craft." },
  "/admin/dashboard/certifications": { title: "Certifications", description: "Credentials and continued learning." },
  "/admin/dashboard/activities": { title: "Activities", description: "Life beyond the code editor." },
  "/admin/dashboard/achievements": { title: "Achievements", description: "Milestones worth remembering." },
  "/admin/dashboard/media": { title: "Media library", description: "Every visual asset in one place." },
  "/admin/dashboard/seo": { title: "SEO", description: "How the world discovers your work." },
  "/admin/dashboard/navigation": { title: "Navigation", description: "Order the journey through the site." },
  "/admin/dashboard/footer": { title: "Footer", description: "The last word and the next step." },
  "/admin/dashboard/theme": { title: "Theme & appearance", description: "Set the visual temperature." },
  "/admin/dashboard/settings": { title: "Website settings", description: "The essential details of your digital home." },
};

export function AdminShell({
  children,
  session,
  unread,
}: {
  children: ReactNode;
  session: Session;
  unread: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const meta = useMemo(() => {
    return (
      titles[pathname] ||
      Object.entries(titles).find(([href]) => pathname.startsWith(`${href}/`))?.[1] || {
        title: "Dashboard",
        description: "Manage your portfolio.",
      }
    );
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((value) => {
      localStorage.setItem("admin-sidebar-collapsed", String(!value));
      return !value;
    });
  };

  const logout = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin");
      router.refresh();
    }
  };

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-[74px] items-center border-b border-white/8 px-5", collapsed ? "justify-center" : "justify-between")}>
        <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#ff7a6b]/30 bg-[#ff7a6b]/10 font-display text-sm text-[#ff7a6b]">
            RM
          </span>
          {!collapsed && (
            <div className="leading-none">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em]">Control room</p>
              <p className="mt-1 text-[0.48rem] uppercase tracking-[0.16em] text-white/25">Portfolio CMS</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button type="button" onClick={toggleCollapsed} className="hidden text-white/25 transition-colors hover:text-white/70 lg:block" aria-label="Collapse sidebar">
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            {!collapsed && (
              <p className="mb-2 px-2.5 text-[0.48rem] font-bold uppercase tracking-[0.2em] text-white/22">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[0.72rem] transition-all duration-200",
                      active ? "text-[#f6f1ff]" : "text-white/40 hover:bg-white/[0.03] hover:text-white/75",
                      collapsed && "justify-center"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-nav-active"
                        className="absolute inset-0 rounded-lg border border-white/8 bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                    <Icon size={15} strokeWidth={1.6} className={cn("relative z-10 shrink-0", active && "text-[#ff7a6b]")} />
                    {!collapsed && <span className="relative z-10 flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge && unread > 0 && (
                      <span className="relative z-10 rounded-full bg-[#ff7a6b] px-1.5 py-0.5 text-[0.48rem] font-bold text-[#0b0714]">{unread}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/8 p-3">
        <Link
          href="/"
          target="_blank"
          className={cn(
            "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[0.7rem] text-white/40 transition-colors hover:bg-white/[0.03] hover:text-white/75",
            collapsed && "justify-center"
          )}
          title="View public site"
        >
          <ExternalLink size={14} />
          {!collapsed && <span>View public site</span>}
        </Link>
        {collapsed && (
          <button type="button" onClick={toggleCollapsed} className="mt-1 flex w-full justify-center rounded-lg px-2.5 py-2.5 text-white/25 hover:text-white/70" aria-label="Expand sidebar">
            <ChevronRight size={15} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="admin-root min-h-screen bg-[#0b0714] text-[#f6f1ff]"
      style={
        {
          "--background": "#0b0714",
          "--background-elevated": "#120c20",
          "--surface": "#171024",
          "--foreground": "#f6f1ff",
          "--foreground-soft": "#c7c3b9",
          "--muted": "#918d84",
          "--line": "rgba(255,255,255,0.09)",
          "--line-strong": "rgba(255,255,255,0.17)",
          "--accent": "#ff7a6b",
          "--accent-soft": "#ffc4ad",
          "--accent-rgb": "255,122,107",
          "--card": "rgba(255,255,255,0.025)",
        } as React.CSSProperties
      }
    >
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden border-r border-white/8 bg-[#151024] transition-[width] duration-300 lg:block",
          collapsed ? "w-[78px]" : "w-[260px]"
        )}
      >
        {Sidebar}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[61] w-[280px] border-r border-white/8 bg-[#151024] lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <button type="button" onClick={() => setMobileOpen(false)} className="absolute right-4 top-5 z-10 text-white/40" aria-label="Close menu">
                <X size={18} />
              </button>
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={cn("transition-[margin] duration-300", collapsed ? "lg:ml-[78px]" : "lg:ml-[260px]")}>
        <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b0714]/80 backdrop-blur-xl">
          <div className="flex h-[74px] items-center justify-between gap-4 px-5 sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileOpen(true)} className="text-white/50 lg:hidden" aria-label="Open menu">
                <Menu size={19} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[0.48rem] uppercase tracking-[0.18em] text-white/25">
                  <span>Admin</span>
                  <span>/</span>
                  <span className="truncate text-white/40">{meta.title}</span>
                </div>
                <h1 className="mt-0.5 truncate font-display text-xl leading-tight text-[#f6f1ff] sm:text-2xl">{meta.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/admin/dashboard/messages" className="relative grid h-9 w-9 place-items-center rounded-full border border-white/8 text-white/45 transition-colors hover:border-white/20 hover:text-white/80" aria-label="Messages">
                <Mail size={14} />
                {unread > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#ff7a6b]" />}
              </Link>
              <div className="hidden items-center gap-2.5 rounded-full border border-white/8 py-1 pl-1 pr-3 sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ff7a6b]/15 font-display text-[0.62rem] text-[#ff7a6b]">
                  {session.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="leading-none">
                  <p className="text-[0.58rem] font-medium text-white/70">{session.name}</p>
                  <p className="mt-0.5 text-[0.45rem] uppercase tracking-[0.14em] text-white/25">{session.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                disabled={signingOut}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/8 text-white/35 transition-colors hover:border-red-400/30 hover:text-red-300 disabled:opacity-50"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-74px)] px-5 py-6 sm:px-7 sm:py-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
