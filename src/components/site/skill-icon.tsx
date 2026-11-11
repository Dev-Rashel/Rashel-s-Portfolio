"use client";

import {
  Atom,
  Braces,
  Code2,
  Database,
  FileCode2,
  Flame,
  GitBranch,
  Github,
  LayoutTemplate,
  Layers,
  Network,
  Palette,
  PenTool,
  Route,
  Send,
  Server,
  Table2,
  Terminal,
  Triangle,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  atom: Atom,
  braces: Braces,
  code: Code2,
  "code-2": Code2,
  database: Database,
  "file-code": FileCode2,
  flame: Flame,
  "git-branch": GitBranch,
  github: Github,
  layout: LayoutTemplate,
  layers: Layers,
  network: Network,
  palette: Palette,
  "pen-tool": PenTool,
  route: Route,
  send: Send,
  server: Server,
  table: Table2,
  terminal: Terminal,
  triangle: Triangle,
  wind: Wind,
  wrench: Wrench,
};

export function SkillIcon({ name, size = 16, className }: { name?: string; size?: number; className?: string }) {
  const Icon = iconMap[(name || "").toLowerCase()] ?? Wrench;
  return <Icon size={size} strokeWidth={1.5} className={className} />;
}
