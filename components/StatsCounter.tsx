"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { useLocale } from "./LocaleProvider";
import type { Dict } from "@/lib/i18n";
import { revealVariants, staggerVariants, useReducedMotion, VIEWPORT } from "@/lib/motion";
import { STATS } from "@/lib/site";

/**
 * Counts from 0 to `value` once, the first time the element enters the
 * viewport, with an ease-out cubic so the number decelerates into place.
 *
 * The previous version observed at `threshold: 0.4` and, critically, only
 * ever set state from inside the observer callback. Two things went wrong:
 * the panel it lives in was being held at 28 % opacity behind a blur by the
 * old scroll animation, and a fast scroll could carry the span past the
 * viewport between two observer ticks — so the figure stayed 0, and whether
 * you saw it at all depended on how fast you scrolled. Now: it triggers on
 * the first pixel of visibility, it checks whether it is *already* on screen
 * at mount, and it always ends on the exact final value.
 */
function useCountUp(value: number, decimals: number, duration = 1600) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        // Land on the exact value rather than on 0.999 × value.
        setDisplay(t < 1 ? value * eased : value);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    // Already on screen when we mount (deep link, back/forward, short page).
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      run();
      return () => cancelAnimationFrame(frame);
    }

    if (typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // fire once — a re-counting stat reads as a glitch
        run();
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration, reduced]);

  return { ref, display: decimals > 0 ? display.toFixed(decimals) : Math.round(display) };
}

function Stat({
  value,
  suffix,
  decimals,
  label,
}: {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
}) {
  const { locale } = useLocale();
  const { ref, display } = useCountUp(value, decimals);

  // Thin-space thousands separator in FR ("10 000"), comma in EN/AR.
  const formatted =
    decimals > 0
      ? String(display).replace(".", locale === "fr" ? "," : ".")
      : Number(display).toLocaleString(locale === "fr" ? "fr-FR" : "en-US");

  return (
    <div className="group relative flex flex-col items-center gap-2 px-4 py-6 text-center">
      <span
        ref={ref}
        className="font-display text-[2.4rem] font-bold leading-none tracking-tight text-ink
          sm:text-[3rem]"
      >
        {/* Tabular figures: without them the panel visibly jitters as the
            digits change width mid-count. */}
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatted}</span>
        <span className="text-gradient">{suffix}</span>
      </span>
      <span className="font-body text-[13px] leading-snug text-white/55">{label}</span>
    </div>
  );
}

export default function StatsCounter() {
  const { t } = useLocale();
  const reduced = useReducedMotion();

  return (
    <div className="shell pb-24 sm:pb-28 lg:pb-32">
      <motion.div
        className="glass relative overflow-hidden rounded-2xl px-4 py-10 sm:px-10 sm:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerVariants(0.09)}
      >
        {/* Soft brand wash behind the figures. Static: the looping shimmer that
            used to sit here repainted the whole panel every frame. */}
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgb(var(--brand-blue-light) / 0.05), transparent 45%, rgb(var(--brand-orange) / 0.05))",
          }}
        />

        <motion.div
          variants={revealVariants(reduced)}
          className="relative flex flex-col items-center gap-3 text-center"
        >
          <span className="eyebrow">{t("stats.eyebrow")}</span>
          <h2 className="max-w-2xl font-display text-[1.7rem] font-bold leading-tight tracking-tight sm:text-[2.1rem]">
            {t("stats.title")}
          </h2>
        </motion.div>

        <motion.div
          variants={revealVariants(reduced)}
          className="relative mt-9 grid grid-cols-2 gap-y-2 divide-white/[0.1] lg:grid-cols-4 lg:divide-x"
        >
          {STATS.map((stat) => (
            <Stat
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              decimals={"decimals" in stat ? stat.decimals : 0}
              label={t(`stats.${stat.id}` as keyof Dict)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
