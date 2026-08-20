"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LogoMark from "./Logo";
import { EASE_BRAND, useReducedMotion } from "@/lib/motion";

const SESSION_KEY = "troc-splash-seen";

/**
 * The load-in.
 *
 * A circular clip-path starts as a small disc at the centre of the viewport
 * and expands past the corners while the logo completes a full 360° turn —
 * the mask and the rotation share one timeline so the logo appears to spin
 * the screen open. Total ~1.45s, then the whole layer fades and scales away
 * into the hero.
 *
 * Shown once per session: `sessionStorage` is read before the first paint of
 * the overlay, so a repeat visit within the tab never sees a flash.
 */
export default function SplashScreen() {
  // `null` = undecided (first client tick), so nothing renders on the server
  // and we avoid a hydration mismatch.
  const [visible, setVisible] = useState<boolean | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const seen = window.sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setVisible(false);
      return;
    }
    setVisible(true);
    window.sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  // Lock the page behind the splash so a scroll during the reveal doesn't
  // desync the hero's entrance.
  useEffect(() => {
    if (visible !== true) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (visible !== true) return;
    const timer = window.setTimeout(dismiss, reduced ? 700 : 1550);
    return () => window.clearTimeout(timer);
  }, [visible, reduced, dismiss]);

  return (
    <AnimatePresence>
      {visible === true && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
          transition={{ duration: reduced ? 0.25 : 0.6, ease: EASE_BRAND }}
          aria-hidden="true"
        >
          {/* Brand wash behind the mask, so the disc reveals colour, not black. */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgb(var(--brand-blue-light) / 0.5), transparent 70%), radial-gradient(40% 40% at 70% 70%, rgb(var(--brand-orange) / 0.28), transparent 70%)",
            }}
            initial={{
              clipPath: reduced
                ? "circle(150% at 50% 50%)"
                : "circle(0% at 50% 50%)",
            }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: reduced ? 0 : 1.35, ease: EASE_BRAND }}
          />

          {/* Expanding ring that trails the mask edge. */}
          {!reduced && (
            <motion.span
              className="absolute rounded-full border border-pure/25"
              style={{ width: 160, height: 160 }}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 12, opacity: 0 }}
              transition={{ duration: 1.45, ease: EASE_BRAND }}
            />
          )}

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              /* The circular mask on the logo itself: it emerges from a disc
                 while turning, matching the fullscreen reveal. */
              className="overflow-hidden rounded-full"
              initial={{
                clipPath: reduced
                  ? "circle(60% at 50% 50%)"
                  : "circle(0% at 50% 50%)",
              }}
              animate={{ clipPath: "circle(60% at 50% 50%)" }}
              transition={{ duration: reduced ? 0 : 0.85, ease: EASE_BRAND }}
            >
              <motion.div
                initial={{ rotate: reduced ? 0 : -360, scale: reduced ? 1 : 0.55 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: reduced ? 0 : 1.25, ease: EASE_BRAND }}
                className="will-transform"
              >
                <LogoMark
                  className="h-[104px] w-[104px] drop-shadow-[0_18px_50px_rgb(var(--brand-orange)/0.35)]"
                  idSuffix="splash"
                />
              </motion.div>
            </motion.div>

            <motion.p
              className="font-display text-lg font-bold tracking-[0.24em] text-pure/90"
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 0.75, duration: 0.5, ease: EASE_BRAND }}
            >
              TROC TRAVAIL
            </motion.p>

            {/* Loading rule that fills over the splash's lifetime. */}
            <motion.span
              className="h-px w-28 origin-left bg-gradient-to-r from-transparent via-orange to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: reduced ? 0 : 0.8, duration: 0.6, ease: EASE_BRAND }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
