"use client";

import { Sparkle } from "lucide-react";

export function Ticker({ items }: { items: string[] }) {
  const list = items.filter(Boolean);
  if (list.length === 0) return null;
  return (
    <div className="relative z-10 overflow-hidden border-y border-[var(--line)] bg-[var(--background)] py-4">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {[0, 1].map((group) => (
          <div key={group} className="flex items-center gap-8">
            {list.map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-8">
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[var(--muted)]">{item}</span>
                <Sparkle size={10} className="text-[var(--accent)]" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
