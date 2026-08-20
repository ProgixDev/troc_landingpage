"use client";

import { motion } from "framer-motion";

import QRCode from "./QRCode";
import StoreBadges from "./StoreBadges";
import { useLocale } from "./LocaleProvider";
import LogoMark from "./Logo";
import { revealVariants, staggerVariants, useReducedMotion, VIEWPORT } from "@/lib/motion";

export default function DownloadCTA() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const reveal = revealVariants(reduced, 30);

  return (
    <div className="shell pb-24 pt-4 sm:pb-28">
      <motion.div
        className="gradient-ring glass-strong relative overflow-hidden rounded-3xl px-7 py-12
          sm:px-12 sm:py-14 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerVariants(0.1)}
      >
        {/* Ambient brand pools, drifting slowly behind the frosted panel. */}
        <span
          className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full
            bg-orange/15 blur-[110px] rm-static"
        />
        <span
          className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full
            bg-blue-light/15 blur-[120px] rm-static"
        />

        <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            <motion.div variants={reveal}>
              <LogoMark className="h-14 w-14" idSuffix="cta" />
            </motion.div>

            <motion.h2
              variants={reveal}
              className="mt-6 max-w-lg font-display text-[2rem] font-bold leading-[1.14]
                tracking-[-0.025em] sm:text-[2.6rem]"
            >
              {t("download.title")}
            </motion.h2>

            <motion.p
              variants={reveal}
              className="mt-4 max-w-md font-body text-[15.5px] leading-relaxed text-white/60"
            >
              {t("download.subtitle")}
            </motion.p>

            <motion.div variants={reveal} className="mt-8">
              <StoreBadges />
            </motion.div>
          </div>

          {/* QR panel — desktop only; on mobile the visitor already has the phone. */}
          <motion.div
            variants={reveal}
            className="hidden shrink-0 flex-col items-center gap-3.5 rounded-xl border
              border-white/15 bg-white/[0.03] p-5 lg:flex"
          >
            <QRCode className="h-32 w-32 rounded-md" />
            <span className="font-body text-[11.5px] uppercase tracking-[0.14em] text-white/55">
              {t("download.qr")}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
