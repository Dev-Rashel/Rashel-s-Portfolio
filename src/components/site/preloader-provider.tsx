"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type PreloaderContextValue = { ready: boolean };

const PreloaderContext = createContext<PreloaderContextValue>({ ready: false });

export function usePreloaderReady() {
  return useContext(PreloaderContext).ready;
}

export function PreloaderProvider({
  children,
  siteName,
  logoMark,
}: {
  children: ReactNode;
  siteName: string;
  logoMark: string;
}) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      setReady(true);
      setVisible(false);
      return;
    }

    let frame = 0;
    let value = 0;
    let finished = false;
    const start = performance.now();
    const duration = 1750;

    const tick = (time: number) => {
      const elapsed = time - start;
      const eased = Math.min(1, elapsed / duration);
      value = Math.min(100, Math.round((1 - Math.pow(1 - eased, 3)) * 100));
      setProgress(value);
      if (eased < 1) {
        frame = requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        setTimeout(() => {
          setReady(true);
          setTimeout(() => setVisible(false), 850);
        }, 220);
      }
    };

    frame = requestAnimationFrame(tick);
    document.documentElement.classList.add("is-loading");

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("is-loading");
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (ready) {
      document.documentElement.classList.remove("is-loading");
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <PreloaderContext.Provider value={{ ready }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-[#0b0817] px-6 py-6 text-[#f4f0fc] sm:px-10 sm:py-8"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            aria-label="Loading portfolio"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 font-display text-lg">
                  {logoMark}
                </span>
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/50">
                  {siteName}
                </span>
              </div>
              <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/40">Portfolio / 2026</span>
            </div>

            <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center font-display text-[clamp(2.6rem,7.2vw,5.8rem)] leading-[0.86] tracking-[-0.04em]"
              >
                A considered <span className="italic text-[#b794f6]">first impression.</span>
              </motion.p>
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between">
                <span className="text-[0.62rem] uppercase tracking-[0.3em] text-white/40">Loading experience</span>
                <span className="font-display text-5xl tabular-nums sm:text-7xl">{String(progress).padStart(3, "0")}</span>
              </div>
              <div className="h-px w-full overflow-hidden bg-white/15">
                <motion.div
                  className="h-full bg-[#b794f6]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <div className="mt-4 flex justify-between text-[0.58rem] uppercase tracking-[0.24em] text-white/30">
                <span>Code · Design · Motion</span>
                <span>Please wait</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PreloaderContext.Provider>
  );
}
