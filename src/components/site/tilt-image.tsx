"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type TiltImageProps = {
  src: string;
  alt: string;
  className?: string;
  badge?: string;
  reveal?: boolean;
};

export function TiltImage({ src, alt, className = "", badge, reveal = true }: TiltImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [7, -7]);
  const rotateY = useTransform(springX, [0, 1], [-9, 9]);
  const imageX = useTransform(springX, [0, 1], ["-2.5%", "2.5%"]);
  const imageY = useTransform(springY, [0, 1], ["-2.5%", "2.5%"]);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setHovered(false);
  };

  return (
    <div className={`relative ${className}`} style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        className="relative h-full w-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[var(--surface)]"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: reveal ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
          transition={{ duration: 1.25, delay: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          {src ? (
            <motion.div className="absolute inset-[-4%]" style={{ x: imageX, y: imageY }}>
              <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes="(max-width: 768px) 92vw, 45vw"
                className="object-cover grayscale-[18%] transition-all duration-700 hover:grayscale-0"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(var(--accent-rgb),0.25),transparent_55%),linear-gradient(145deg,var(--surface),var(--background))]">
              <span className="font-display text-8xl italic text-[var(--accent)]/40">RM</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </motion.div>
        {badge && (
          <motion.div
            className="absolute -bottom-2 -left-4 hidden rounded-full border border-[var(--line-strong)] bg-[var(--background)] px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-soft)] sm:block"
            animate={{ y: hovered ? -4 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {badge}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
