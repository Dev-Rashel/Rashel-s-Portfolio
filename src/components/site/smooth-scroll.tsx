"use client";

import { useEffect } from "react";

const SCROLL_OFFSET = -84;

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: import("lenis").default | null = null;
    let raf: ((time: number) => void) | null = null;
    let cancelled = false;

    const init = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.25,
      });

      lenis.on("scroll", ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      window.__lenis = lenis;

      const onClick = (event: MouseEvent) => {
        const target = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]');
        if (!target) return;
        const href = target.getAttribute("href");
        if (!href) return;
        const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
        if (!hash) return;
        const element = document.querySelector(hash);
        if (!element) return;
        event.preventDefault();
        lenis?.scrollTo(element as HTMLElement, { offset: SCROLL_OFFSET, duration: 1.35 });
        window.history.pushState(null, "", hash);
      };

      document.addEventListener("click", onClick);
      ScrollTrigger.refresh();

      return () => document.removeEventListener("click", onClick);
    };

    let cleanupClick: (() => void) | undefined;
    init().then((cleanup) => {
      cleanupClick = cleanup;
    });

    return () => {
      cancelled = true;
      cleanupClick?.();
      if (raf) {
        import("gsap").then(({ gsap }) => gsap.ticker.remove(raf!));
      }
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    __lenis?: import("lenis").default;
  }
}
