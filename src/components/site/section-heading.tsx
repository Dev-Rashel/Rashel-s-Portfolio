"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  index,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  index?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-7",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {eyebrow}
        </motion.div>
        <div className="mt-5 overflow-hidden">
          <motion.h2
            className="display-title text-[clamp(2.4rem,4.6vw,4.4rem)]"
            initial={{ y: "105%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h2>
        </div>
        {description && (
          <motion.p
            className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {description}
          </motion.p>
        )}
      </div>
      {index && (
        <motion.span
          className="hidden font-display text-6xl italic leading-none text-[var(--line-strong)] md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {index}
        </motion.span>
      )}
    </div>
  );
}
