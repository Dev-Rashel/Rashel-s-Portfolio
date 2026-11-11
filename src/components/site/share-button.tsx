"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setOpen(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 2200);
    } catch {
      setOpen(false);
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch {
        /* user cancelled */
      }
    }
    copy();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={nativeShare}
        className="flex items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-soft)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        {copied ? <Check size={12} /> : <Share2 size={12} />}
        {copied ? "Copied" : "Share"}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 flex items-center gap-2 whitespace-nowrap rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[0.58rem] text-[var(--foreground-soft)] shadow-xl">
          <Link2 size={11} className="text-[var(--accent)]" /> Link copied
        </div>
      )}
    </div>
  );
}
