"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { usePreloaderReady } from "./preloader-provider";

type CharRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  playOnLoad?: boolean;
  as?: "span" | "h1" | "h2" | "p";
};

export function CharReveal({
  text,
  className,
  delay = 0,
  stagger = 0.028,
  playOnLoad = false,
  as = "span",
}: CharRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const ready = usePreloaderReady();
  const play = playOnLoad ? ready : inView;
  const Tag = motion[as];

  return (
    <Tag
      ref={ref as never}
      className={className}
      initial="hidden"
      animate={play ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {text.split(" ").map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap" aria-hidden>
          {Array.from(word).map((char, charIndex) => (
            <span key={`${char}-${charIndex}`} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "115%", rotate: 2, opacity: 0 },
                  show: {
                    y: "0%",
                    rotate: 0,
                    opacity: 1,
                    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                {char}
              </motion.span>
            </span>
          ))}
          {wordIndex < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
