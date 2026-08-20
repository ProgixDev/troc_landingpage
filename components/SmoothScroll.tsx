"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useCoarsePointer, useReducedMotion } from "@/lib/motion";

/**
 * Owns the scroll runtime: Lenis inertia on pointer devices, wired to GSAP's
 * ticker so ScrollTrigger reads the same virtual position.
 *
 * Touch devices are deliberately left on native scrolling. A JS-driven scroll
 * on a phone runs a rAF loop against the browser's own compositor-thread
 * scrolling, which is where most of the reported stutter (and the occasional
 * tab kill on long pages) came from. Anchor links there fall back to the
 * browser's own smooth scroll.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const nav = 90;

    // --- Native path: reduced motion, or any touch device -------------------
    if (reduced || coarse) {
      const onAnchorClick = (event: MouseEvent) => {
        const anchor = (event.target as HTMLElement | null)?.closest?.(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        if (!anchor) return;
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        const top =
          (target as HTMLElement).getBoundingClientRect().top + window.scrollY - nav;
        window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      };

      document.addEventListener("click", onAnchorClick);
      ScrollTrigger.refresh();
      return () => document.removeEventListener("click", onAnchorClick);
    }

    // --- Inertia path: mouse / trackpad only --------------------------------
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    // `lagSmoothing(0)` was here: it tells GSAP never to clamp a long frame,
    // so after any stall the ticker tries to catch up in one jump and the
    // scrubbed animations snap. The default clamp is the right behaviour.
    gsap.ticker.lagSmoothing(500, 33);

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -nav, duration: 1.2 });
    };
    document.addEventListener("click", onAnchorClick);

    // Fonts and images landing after hydration change every trigger's
    // position; without a refresh the scroll-driven pieces are measured
    // against a layout that no longer exists.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [reduced, coarse]);

  return null;
}
