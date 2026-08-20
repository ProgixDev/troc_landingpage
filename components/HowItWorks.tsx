"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SectionHeading from "./SectionHeading";
import { useLocale } from "./LocaleProvider";
import {
  IconChat,
  IconExchange,
  IconProfile,
  IconPublish,
  IconStar,
  type IconProps,
} from "./icons/BrandIcons";
import type { Dict } from "@/lib/i18n";
import { EASE_BRAND, revealVariants, staggerVariants, useReducedMotion, VIEWPORT } from "@/lib/motion";
import { STEPS } from "@/lib/site";

const ICONS: Record<(typeof STEPS)[number], (props: IconProps) => JSX.Element> = {
  onboarding: IconProfile,
  publish: IconPublish,
  negotiate: IconChat,
  trade: IconExchange,
  rate: IconStar,
};

/** How long each step holds before the walkthrough moves on. */
const DWELL_MS = 3200;

const DESKTOP_PATH =
  "M100 20 C 200 4, 240 36, 300 20 S 440 4, 500 20 S 640 36, 700 20 S 840 4, 900 20";

export default function HowItWorks() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  /**
   * The walkthrough runs itself: the connector draws to the current step, that
   * node lights up, and a ring counts down the dwell before it advances.
   *
   * It only ticks while the section is actually on screen — an interval
   * driving springs behind the fold is wasted work, and it also means the
   * sequence starts at step 1 when the visitor arrives instead of being
   * halfway through by the time they get here.
   *
   * This replaced two scroll-scrubbed GSAP tweens. One of them held every node
   * at `opacity: .35` until its own trigger resolved, so a step whose trigger
   * never fired simply stayed dimmed.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // A timeout rather than an interval: picking a step by hand restarts the
  // dwell instead of leaving it to fire a moment later.
  useEffect(() => {
    if (reduced || !inView || paused) return;
    const id = window.setTimeout(
      () => setActive((current) => (current + 1) % STEPS.length),
      DWELL_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, reduced, inView, paused]);

  // Reduced motion gets the finished state: every step lit, nothing moving.
  const progress = reduced ? 1 : active / (STEPS.length - 1);
  const stateOf = (i: number) => ({
    isActive: reduced || i === active,
    isDone: reduced || i < active,
  });

  const hold = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
  };

  /** The countdown ring drawn around the step currently holding. */
  const DwellRing = ({ show }: { show: boolean }) => (
    <AnimatePresence>
      {show && (
        <motion.svg
          key={active}
          className="pointer-events-none absolute -inset-1 -rotate-90"
          viewBox="0 0 100 100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-hidden="true"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="rgb(var(--brand-orange))"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: DWELL_MS / 1000, ease: "linear" }}
          />
        </motion.svg>
      )}
    </AnimatePresence>
  );

  const nodeClass = (isActive: boolean, isDone: boolean) =>
    `glass-strong relative flex h-[60px] w-[60px] items-center justify-center rounded-full
     transition-colors duration-500 ease-brand
     ${
       isActive
         ? "border-orange/60 text-orange shadow-[0_0_0_6px_rgb(var(--brand-orange)/0.1)]"
         : isDone
           ? "border-orange/30 text-orange/80"
           : "text-white/55"
     }`;

  return (
    <div ref={rootRef} className="shell py-24 sm:py-28 lg:py-32" {...hold}>
      <SectionHeading
        eyebrow={t("how.eyebrow")}
        title={t("how.title")}
        subtitle={t("how.subtitle")}
      />

      {/* --- Desktop: horizontal stepper with a connector that draws itself --- */}
      <div className="relative mt-20 hidden lg:block">
        <svg
          className="absolute inset-x-0 top-[30px] -z-10 h-24 w-full overflow-visible"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="how-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "rgb(var(--brand-blue-light))" }} />
              <stop offset="0.5" style={{ stopColor: "rgb(var(--brand-orange))" }} />
              <stop offset="1" style={{ stopColor: "rgb(var(--brand-blue-light))" }} />
            </linearGradient>
          </defs>
          {/* Track behind the animated stroke, so the path reads as unfilled. */}
          <path
            d={DESKTOP_PATH}
            fill="none"
            stroke="rgb(var(--fg) / 0.12)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          {/* `pathLength` lets framer-motion own the dasharray maths, so the
              stroke grows to exactly the active node at any breakpoint — no
              measuring the path at runtime, and nothing tied to scroll. */}
          <motion.path
            d={DESKTOP_PATH}
            fill="none"
            stroke="url(#how-line)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: reduced ? 0 : 0.8, ease: EASE_BRAND }}
          />
        </svg>

        <motion.ol
          className="grid grid-cols-5 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={staggerVariants(0.1)}
        >
          {STEPS.map((step, i) => {
            const Icon = ICONS[step];
            const { isActive, isDone } = stateOf(i);

            return (
              <motion.li
                key={step}
                variants={revealVariants(reduced, 30)}
                className="flex flex-col items-center"
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex flex-col items-center text-center"
                >
                  <motion.span
                    animate={{ scale: isActive && !reduced ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={nodeClass(isActive, isDone)}
                  >
                    <DwellRing show={isActive && !reduced && !paused && inView} />

                    <motion.span
                      animate={
                        isActive && !reduced
                          ? { scale: [1, 1.18, 1], rotate: [0, -8, 0] }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.6, ease: EASE_BRAND }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.span>

                    <motion.span
                      animate={{ scale: isActive && !reduced ? 1.15 : 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center
                        rounded-full bg-gradient-to-br from-orange to-orange-dark font-display
                        text-[10px] font-bold text-pure"
                    >
                      {i + 1}
                    </motion.span>
                  </motion.span>

                  <motion.h3
                    animate={{ y: isActive && !reduced ? -2 : 0 }}
                    transition={{ duration: 0.4, ease: EASE_BRAND }}
                    className={`mt-6 font-display text-[15.5px] font-bold leading-snug
                      transition-colors duration-500
                      ${isActive ? "text-orange" : "text-ink group-hover:text-orange/80"}`}
                  >
                    {t(`how.${step}.title` as keyof Dict)}
                  </motion.h3>

                  <motion.p
                    animate={{ opacity: isActive ? 1 : 0.55 }}
                    transition={{ duration: 0.45, ease: EASE_BRAND }}
                    className="mt-2.5 font-body text-[13.5px] leading-relaxed text-white/60"
                  >
                    {t(`how.${step}.desc` as keyof Dict)}
                  </motion.p>
                </button>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>

      {/* --- Mobile / tablet: vertical stepper, same walkthrough --- */}
      <div className="relative mt-14 lg:hidden">
        {/* Track + fill. A scaled div rather than an SVG path: the column's
            height changes with the copy, and `scaleY` follows it for free. */}
        <div className="absolute bottom-0 start-[29px] top-0 w-px overflow-hidden bg-white/15">
          <motion.div
            className="h-full w-full origin-top"
            style={{
              background:
                "linear-gradient(180deg, rgb(var(--brand-blue-light)), rgb(var(--brand-orange)))",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress }}
            transition={{ duration: reduced ? 0 : 0.8, ease: EASE_BRAND }}
          />
        </div>

        <motion.ol
          className="flex flex-col gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={staggerVariants(0.1)}
        >
          {STEPS.map((step, i) => {
            const Icon = ICONS[step];
            const { isActive, isDone } = stateOf(i);

            return (
              <motion.li key={step} variants={revealVariants(reduced, 26)}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "step" : undefined}
                  className="flex w-full items-start gap-5 text-start"
                >
                  <motion.span
                    animate={{ scale: isActive && !reduced ? 1.08 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`${nodeClass(isActive, isDone)} shrink-0`}
                  >
                    <DwellRing show={isActive && !reduced && !paused && inView} />

                    <motion.span
                      animate={
                        isActive && !reduced
                          ? { scale: [1, 1.18, 1], rotate: [0, -8, 0] }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.6, ease: EASE_BRAND }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.span>

                    <span
                      className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center
                        rounded-full bg-gradient-to-br from-orange to-orange-dark font-display
                        text-[10px] font-bold text-pure"
                    >
                      {i + 1}
                    </span>
                  </motion.span>

                  <motion.div
                    animate={{ x: isActive && !reduced ? 4 : 0, opacity: isActive ? 1 : 0.62 }}
                    transition={{ duration: 0.45, ease: EASE_BRAND }}
                    className="pt-2.5"
                  >
                    <p
                      className={`font-body text-[10.5px] uppercase tracking-[0.18em]
                        transition-colors duration-500
                        ${isActive ? "text-orange" : "text-white/40"}`}
                    >
                      {t("how.step")} {i + 1}
                    </p>
                    <h3
                      className={`mt-1.5 font-display text-[17px] font-bold transition-colors
                        duration-500 ${isActive ? "text-orange" : "text-ink"}`}
                    >
                      {t(`how.${step}.title` as keyof Dict)}
                    </h3>
                    <p className="mt-2 font-body text-[14px] leading-relaxed text-white/60">
                      {t(`how.${step}.desc` as keyof Dict)}
                    </p>
                  </motion.div>
                </button>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </div>
  );
}
