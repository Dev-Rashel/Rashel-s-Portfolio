"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";
type ToastItem = { id: number; message: string; type: ToastType };

export function toast(message: string, type: ToastType = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("admin-toast", { detail: { message, type } }));
}

export function AdminToaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    let counter = 0;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; type: ToastType }>).detail;
      if (!detail?.message) return;
      counter += 1;
      const item = { id: Date.now() + counter, message: detail.message, type: detail.type || "success" };
      setItems((current) => [...current, item].slice(-4));
      setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== item.id));
      }, 4200);
    };
    window.addEventListener("admin-toast", handler);
    return () => window.removeEventListener("admin-toast", handler);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-2">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-white/10 bg-[#151410] p-3.5 shadow-2xl"
          >
            <span
              className={
                item.type === "error"
                  ? "mt-0.5 text-red-300"
                  : item.type === "info"
                    ? "mt-0.5 text-sky-300"
                    : "mt-0.5 text-emerald-300"
              }
            >
              {item.type === "error" ? <AlertCircle size={15} /> : item.type === "info" ? <Info size={15} /> : <CheckCircle2 size={15} />}
            </span>
            <p className="flex-1 text-xs leading-relaxed text-white/75">{item.message}</p>
            <button
              type="button"
              onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
              className="text-white/25 transition-colors hover:text-white/60"
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
