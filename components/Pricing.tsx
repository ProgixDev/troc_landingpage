"use client";

import { motion } from "framer-motion";

import SectionHeading from "./SectionHeading";
import { useLocale } from "./LocaleProvider";
import { IconArrowRight, IconCheck } from "./icons/BrandIcons";
import type { Dict } from "@/lib/i18n";
import { revealVariants, staggerVariants, useReducedMotion, VIEWPORT } from "@/lib/motion";
import { formatPrice, PLANS, SITE } from "@/lib/site";

/** Feature-line counts per plan — the dictionary holds `pricing.<plan>.f1…fN`. */
const FEATURE_COUNT: Record<string, number> = { free: 4, monthly: 5, annual: 4 };

export default function Pricing() {
  const { t, locale } = useLocale();
  const reduced = useReducedMotion();

  return (
    <div className="shell py-24 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow={t("pricing.eyebrow")}
        title={t("pricing.title")}
        subtitle={t("pricing.subtitle")}
      />

      <motion.div
        className="mt-16 grid items-start gap-5 lg:grid-cols-3 lg:gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerVariants(0.11, 0.1)}
      >
        {PLANS.map((plan) => {
          const featured = plan.featured;
          const periodLabel = t(`pricing.period.${plan.period}` as keyof Dict);

          return (
            <motion.div
              key={plan.id}
              variants={revealVariants(reduced, 34)}
              whileHover={reduced ? {} : { y: -8 }}
              transition={{ duration: 0.4 }}
              className={`glass relative flex flex-col rounded-2xl p-7 will-transform lg:p-8
                ${
                  featured
                    ? "gradient-ring lg:-mt-5 lg:pb-11 shadow-[0_34px_80px_-40px_rgb(var(--brand-orange)/0.55)]"
                    : "hover:border-white/20 hover:shadow-[0_26px_56px_-34px_rgb(12_34_68/0.4)]"
                }`}
            >
              {featured && (
                <>
                  {/* Brand wash behind the highlighted plan. */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(110% 80% at 50% 0%, rgb(var(--brand-orange) / 0.1), transparent 60%)",
                    }}
                  />
                  <span
                    className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full
                      bg-gradient-to-r from-orange to-orange-dark px-4 py-1.5 font-body
                      text-[11px] font-semibold uppercase tracking-[0.14em] text-pure
                      shadow-[0_10px_26px_-10px_rgb(var(--brand-orange)/0.95)] rtl:translate-x-1/2"
                  >
                    {t("pricing.popular")}
                  </span>
                </>
              )}

              <div className="relative">
                <h3 className="font-display text-[1.4rem] font-bold tracking-tight">
                  {t(`pricing.${plan.id}.name` as keyof Dict)}
                </h3>
                <p className="mt-1.5 font-body text-[13.5px] text-white/55">
                  {t(`pricing.${plan.id}.tagline` as keyof Dict)}
                </p>

                <div className="mt-7 flex items-end gap-1.5">
                  <span
                    className={`font-display text-[3rem] font-bold leading-none tracking-tight
                      ${featured ? "text-gradient" : "text-ink"}`}
                  >
                    {formatPrice(plan.price, locale)}
                    <span className="text-[2rem]"> €</span>
                  </span>
                  <span className="pb-2 font-body text-[13px] text-white/50">{periodLabel}</span>
                </div>

                <span className="rule my-7 block" />

                <ul className="flex flex-col gap-3.5">
                  {Array.from({ length: FEATURE_COUNT[plan.id] }, (_, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 font-body text-[14px] leading-snug text-white/70"
                    >
                      <span
                        className={`mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center
                          rounded-full ${featured ? "bg-orange/15" : "bg-white/[0.07]"}`}
                      >
                        <IconCheck
                          className={`h-3 w-3 ${featured ? "text-orange" : "text-white/70"}`}
                          strokeWidth={2.4}
                        />
                      </span>
                      {t(`pricing.${plan.id}.f${i + 1}` as keyof Dict)}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={SITE.appStoreUrl}
                className={`group relative mt-9 inline-flex items-center justify-center gap-2
                  rounded-full px-6 py-3.5 font-body text-[14.5px] font-semibold
                  transition-all duration-300 ease-brand will-transform
                  ${
                    featured
                      ? "bg-gradient-to-r from-orange to-orange-dark text-pure shadow-[0_14px_36px_-14px_rgb(var(--brand-orange)/0.95)] hover:-translate-y-0.5"
                      : "border border-white/15 bg-white/[0.04] text-white/80 hover:border-orange/40 hover:bg-orange/5 hover:text-orange"
                  }`}
              >
                {plan.price === 0 ? t("pricing.cta.free") : t("pricing.cta.paid")}
                <IconArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        className="mt-9 text-center font-body text-[13px] text-white/45"
      >
        {t("pricing.note")}
      </motion.p>
    </div>
  );
}
