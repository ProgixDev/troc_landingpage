"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SectionHeading from "./SectionHeading";
import { useLocale } from "./LocaleProvider";
import {
  IconBalance,
  IconCheck,
  IconGoods,
  IconService,
  type IconProps,
} from "./icons/BrandIcons";
import type { Dict } from "@/lib/i18n";
import {
  EASE_BRAND,
  revealVariants,
  staggerVariants,
  useMediaQuery,
  useReducedMotion,
  VIEWPORT,
} from "@/lib/motion";
import { TRADE_MODES, type TradeMode } from "@/lib/site";

const ICONS: Record<TradeMode, (props: IconProps) => JSX.Element> = {
  prestation: IconService,
  objet: IconGoods,
  compensation: IconBalance,
};

/** Spring used for the carousel itself — snappy enough to read as a detent. */
const SPIN = { type: "spring", stiffness: 240, damping: 26, mass: 0.9 } as const;

/**
 * The three sides of a trade, as a curved carousel.
 *
 * Selecting a card swings the row like a spinner: the chosen card rotates flat
 * to face the reader and comes forward, while the others turn away from the
 * centre and drop back along an arc, so the three sit on a curve rather than a
 * flat row. Its icon tile does a full turn on the way in.
 *
 * All of it is `transform` + `opacity` on three elements, driven by a click —
 * never by a scroll scrub — and each card carries its own
 * `transformPerspective` instead of living inside a shared `preserve-3d`
 * context. That is what keeps this safe: the combination that used to make
 * cards render blank was a 3D context wrapping `backdrop-filter` panels, and
 * the cost that caused the stutter was scrubbing `filter`/`scale` over whole
 * sections every frame. Neither is present here.
 */
export default function FeatureCards() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  // The arc only makes sense on the three-column row; stacked on mobile the
  // cards animate flat. `false` until measured, which is also the safe
  // server-render state.
  const wide = useMediaQuery("(min-width: 768px)");
  const [selected, setSelected] = useState<TradeMode>("prestation");
  const reveal = revealVariants(reduced, 34);

  const selectedIndex = TRADE_MODES.indexOf(selected);
  const arc = wide && !reduced;

  /** Where a card sits on the curve, given its distance from the selected one. */
  const placeOnArc = (offset: number) => {
    if (!arc) {
      return { rotateY: 0, z: 0, y: 0, scale: reduced ? 1 : offset === 0 ? 1.02 : 1 };
    }
    const distance = Math.abs(offset);
    return {
      // Side cards turn to face the centre; the further out, the more they turn.
      rotateY: -offset * 15,
      // …and fall away from the reader, which is what bends the row into a curve.
      z: offset === 0 ? 80 : -70 * distance,
      // The vertical drop is the arc itself.
      y: offset === 0 ? -16 : 14 * distance,
      scale: offset === 0 ? 1.04 : 0.95 - 0.02 * (distance - 1),
    };
  };

  return (
    <div className="shell py-24 sm:py-28 lg:py-36">
      <SectionHeading
        eyebrow={t("features.eyebrow")}
        title={t("features.title")}
        subtitle={t("features.subtitle")}
      />

      {/*
       * `items-start` and no `layout` prop, deliberately: giving each card
       * framer-motion's `layout` meant opening the points list re-measured and
       * re-flowed all three every frame of the transition, and the last card —
       * measured after the row height had already changed — was the one that
       * ended up clipped out of view.
       *
       * The extra padding is headroom for the arc, which lifts the middle card
       * and pushes the outer ones down past the grid's own box.
       */}
      <motion.div
        className="mt-14 grid items-start gap-5 py-8 md:grid-cols-3 lg:mt-16 lg:gap-7"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerVariants(0.11, 0.08)}
      >
        {TRADE_MODES.map((mode, index) => {
          const Icon = ICONS[mode];
          const isSelected = selected === mode;
          const place = placeOnArc(index - selectedIndex);

          return (
            <motion.div key={mode} variants={reveal}>
              <motion.button
                type="button"
                onClick={() => setSelected(mode)}
                aria-pressed={isSelected}
                animate={place}
                whileHover={reduced || isSelected ? {} : { y: place.y - 8, scale: place.scale + 0.02 }}
                transition={SPIN}
                style={{ transformPerspective: 1600 }}
                className={`glass group relative flex h-full w-full flex-col items-start gap-4
                  overflow-hidden rounded-xl p-7 text-start
                  transition-[border-color,box-shadow] duration-500 ease-brand
                  will-transform lg:p-8
                  ${
                    isSelected
                      ? "z-10 border-orange/50 shadow-[0_0_0_1px_rgb(var(--brand-orange)/0.3),0_38px_80px_-38px_rgb(var(--brand-orange)/0.65)]"
                      : "hover:border-orange/30 hover:shadow-[0_26px_56px_-34px_rgb(12_34_68/0.45)]"
                  }`}
              >
                {/* Radial brand wash that fades in on hover / selection. */}
                <span
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500
                    ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`}
                  style={{
                    background:
                      "radial-gradient(120% 90% at 12% 0%, rgb(var(--brand-orange) / 0.1), transparent 62%)",
                  }}
                />

                {/* Light sweeping across the face as the card swings in. */}
                <AnimatePresence>
                  {isSelected && !reduced && (
                    <motion.span
                      key={`sheen-${mode}`}
                      className="pointer-events-none absolute inset-y-0 w-1/2"
                      style={{
                        background:
                          "linear-gradient(100deg, transparent, rgb(var(--brand-orange) / 0.16), transparent)",
                      }}
                      initial={{ x: "-130%" }}
                      animate={{ x: "260%" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.95, ease: EASE_BRAND }}
                    />
                  )}
                </AnimatePresence>

                {/* Selected badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
                      transition={{ duration: 0.35, ease: EASE_BRAND }}
                      className="absolute end-6 top-6 flex h-7 w-7 items-center justify-center
                        rounded-full bg-gradient-to-br from-orange to-orange-dark
                        shadow-[0_8px_20px_-6px_rgb(var(--brand-orange)/0.9)]"
                    >
                      <IconCheck className="h-4 w-4 text-pure" strokeWidth={2.2} />
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Icon tile — spins a full turn as the card is chosen. 360°
                    is its own resting state, so deselecting can snap back to 0
                    without anything visibly moving. */}
                <motion.span
                  animate={{ rotateY: isSelected && !reduced ? 360 : 0 }}
                  transition={
                    isSelected && !reduced
                      ? { duration: 0.8, ease: EASE_BRAND }
                      : { duration: 0 }
                  }
                  style={{ transformPerspective: 600 }}
                  className={`relative flex h-14 w-14 items-center justify-center rounded-md border
                    transition-colors duration-500 ease-brand
                    ${
                      isSelected
                        ? "border-orange/40 bg-orange/10 text-orange"
                        : "border-white/10 bg-white/[0.04] text-white/60 group-hover:border-orange/30 group-hover:text-orange"
                    }`}
                >
                  <Icon
                    className={`h-7 w-7 transition-transform duration-500 ease-brand
                      ${isSelected ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-6"}`}
                  />
                </motion.span>

                <div className="relative">
                  <h3 className="font-display text-[1.35rem] font-bold tracking-tight">
                    {t(`features.${mode}.title` as keyof Dict)}
                  </h3>
                  <p className="mt-2.5 font-body text-[14.5px] leading-relaxed text-white/60">
                    {t(`features.${mode}.desc` as keyof Dict)}
                  </p>
                </div>

                {/* Detail list, revealed only on the selected card. */}
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.ul
                      key="points"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE_BRAND }}
                      className="relative w-full overflow-hidden"
                    >
                      <span className="rule mb-4 mt-1 block" />
                      {([1, 2, 3] as const).map((n, i) => (
                        <motion.li
                          key={n}
                          initial={{ opacity: 0, x: reduced ? 0 : -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.12 + i * 0.07, duration: 0.35, ease: EASE_BRAND }}
                          className="flex items-center gap-2.5 py-1.5 font-body text-[13.5px] text-white/70"
                        >
                          <IconCheck className="h-4 w-4 shrink-0 text-orange" strokeWidth={2} />
                          {t(`features.${mode}.point${n}` as keyof Dict)}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                <span
                  className={`relative mt-auto pt-2 font-body text-[12px] font-semibold uppercase
                    tracking-[0.16em] transition-colors duration-300
                    ${isSelected ? "text-orange" : "text-white/35 group-hover:text-white/60"}`}
                >
                  {isSelected ? t("features.selected") : t("features.select")}
                </span>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Carousel detents — the position indicator the arc implies. */}
      <div className="mt-4 flex items-center justify-center gap-2.5">
        {TRADE_MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setSelected(mode)}
            aria-label={t(`features.${mode}.title` as keyof Dict)}
            className="group p-1.5"
          >
            <motion.span
              className={`block h-1.5 rounded-full transition-colors duration-500
                ${
                  selected === mode
                    ? "bg-orange"
                    : "bg-white/20 group-hover:bg-orange/40"
                }`}
              animate={{ width: selected === mode ? 30 : 8 }}
              transition={{ duration: 0.4, ease: EASE_BRAND }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
