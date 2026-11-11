"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed left-0 right-0 top-[73px] z-[119] h-px origin-left bg-[var(--accent)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
