"use client";

import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";

/** Live `prefers-reduced-motion` reading — re-renders when the OS setting flips. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Live media-query match. Starts `false` on the server and on the first client
 * render, so anything gated on it must degrade to the plain, non-animated
 * layout rather than depending on it — otherwise hydration mismatches.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/**
 * True on touch/coarse-pointer devices. Used to skip the effects that are
 * cheap on a desktop GPU and ruinous on a phone (inertia scroll hijacking,
 * pointer parallax, oversized blurred orbs).
 */
export function useCoarsePointer() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

export const EASE_BRAND = [0.22, 1, 0.36, 1] as const;

/**
 * The page's standard reveal: a rise and a fade.
 *
 * It used to animate `filter: blur()` as well. That is a per-frame full-subtree
 * repaint — with a dozen of them live at once during a fast scroll it was the
 * single biggest source of the stutter, and on mobile Chrome the blurred layer
 * intermittently composited as blank, so cards "sometimes appeared and
 * sometimes didn't". Transform + opacity only, so it stays on the compositor.
 */
export function revealVariants(reduced: boolean, distance = 28): Variants {
  return {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.25 : 0.6, ease: EASE_BRAND },
    },
  };
}

/** Parent variant that walks its children in, `stagger` seconds apart. */
export function staggerVariants(stagger = 0.09, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

/**
 * Shared viewport config so every section triggers at the same scroll depth.
 *
 * `amount` is deliberately small: at 0.25 a grid taller than the viewport (the
 * pricing row on a phone, the feature cards in landscape) can never reach the
 * threshold, so it stayed at `hidden` forever — that is the "offers don't show
 * up when I scroll" case. A small `margin` also arms it slightly before the
 * element's top edge crosses in, so a fast flick never scrolls past an
 * un-revealed block.
 */
export const VIEWPORT = { once: true, amount: 0.1, margin: "0px 0px -40px 0px" } as const;
