"use client";

import { motion } from "framer-motion";

import { revealVariants, staggerVariants, useReducedMotion, VIEWPORT } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
};

/** The eyebrow / title / subtitle stack every section opens with. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  const reduced = useReducedMotion();
  const reveal = revealVariants(reduced);

  return (
    <motion.div
      className={`flex flex-col gap-5 ${
        align === "center" ? "items-center text-center" : "items-start text-start"
      }`}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerVariants(0.1)}
    >
      <motion.span variants={reveal} className="eyebrow">
        {eyebrow}
      </motion.span>

      <motion.h2
        variants={reveal}
        className="max-w-3xl font-display text-[2rem] font-bold leading-[1.12] tracking-[-0.025em]
          sm:text-[2.6rem] lg:text-[3.1rem]"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={reveal}
          className="max-w-2xl font-body text-[15.5px] leading-relaxed text-white/60 sm:text-[16.5px]"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
