"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end", className)}>
      <div>
        {eyebrow && <p className="text-[0.52rem] font-bold uppercase tracking-[0.2em] text-[#ff7a6b]">{eyebrow}</p>}
        <h2 className="mt-1.5 font-display text-3xl leading-tight text-[#f6f1ff] sm:text-[2.1rem]">{title}</h2>
        {description && <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-white/35">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  children,
  className,
  title,
  description,
  actions,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border border-white/8 bg-white/[0.018]", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/7 px-5 py-4">
          <div>
            {title && <h3 className="text-sm font-medium text-white/80">{title}</h3>}
            {description && <p className="mt-0.5 text-[0.65rem] text-white/30">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "soft";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[#ff7a6b] text-[#0b0714] hover:bg-[#ffc4ad]",
        variant === "ghost" && "border border-white/10 text-white/60 hover:border-white/25 hover:text-white",
        variant === "soft" && "border border-[#ff7a6b]/20 bg-[#ff7a6b]/10 text-[#ff7a6b] hover:bg-[#ff7a6b]/15",
        variant === "danger" && "border border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/15",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.12em]",
        tone === "success" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        tone === "warning" && "border-amber-400/20 bg-amber-400/10 text-amber-300",
        tone === "danger" && "border-red-400/20 bg-red-400/10 text-red-300",
        tone === "accent" && "border-[#ff7a6b]/20 bg-[#ff7a6b]/10 text-[#ff7a6b]",
        tone === "neutral" && "border-white/10 bg-white/[0.03] text-white/40"
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-white/20">{icon}</div>}
      <p className="font-display text-2xl text-white/70">{title}</p>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/30">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      aria-label="Loading"
    />
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-white/5">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-white/[0.03]" />
          </div>
        </div>
      ))}
    </div>
  );
}
