"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PhoneMockup from "./PhoneMockup";
import StoreBadges from "./StoreBadges";
import { useLocale } from "./LocaleProvider";
import { IconArrowRight, IconExchange, IconPin, IconShield } from "./icons/BrandIcons";
import { EASE_BRAND, useCoarsePointer, useReducedMotion } from "@/lib/motion";

export default function Hero() {
  const { t } = useLocale();
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- Mouse tilt (Apple product-page style) -------------------------------
  // Raw pointer position, normalised to -0.5…0.5, then spring-smoothed so the
  // phone lags the cursor slightly instead of snapping to it.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 110, damping: 18, mass: 0.6 });
  const springY = useSpring(pointerY, { stiffness: 110, damping: 18, mass: 0.6 });

  const still = reduced || coarse;
  const rotateY = useTransform(springX, [-0.5, 0.5], still ? [0, 0] : [-11, 11]);
  const rotateX = useTransform(springY, [-0.5, 0.5], still ? [0, 0] : [8, -8]);

  useEffect(() => {
    if (still) return;
    const el = sectionRef.current;
    if (!el) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    const onPointerLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [pointerX, pointerY, still]);

  // --- Scroll parallax -----------------------------------------------------
  // Desktop only, and transform-only: the copy no longer fades out on scroll
  // (an opacity scrub on a text block forces it into its own layer for the
  // whole scroll) and the background layers move rather than blur.
  useEffect(() => {
    if (still) return;
    const el = sectionRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to("[data-parallax='copy']", { y: -70, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-parallax='phone']", { y: -28, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-parallax='orb-a']", { y: 90, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-parallax='orb-b']", { y: 55, ease: "none", scrollTrigger: scrub });
    }, el);

    return () => ctx.revert();
  }, [still]);

  const trustPoints = [
    { Icon: IconPin, key: "features.prestation.point3" },
    { Icon: IconShield, key: "how.rate.title" },
    { Icon: IconExchange, key: "features.compensation.point2" },
  ] as const;

  return (
    <div
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden pb-24 pt-[calc(var(--nav-h)+3rem)] sm:pb-28 lg:pb-36 lg:pt-[calc(var(--nav-h)+5rem)]"
    >
      {/* --- Ambient background layers (slowest parallax) --- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--fg) / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--fg) / 0.045) 1px, transparent 1px)",
            backgroundSize: "68px 68px",
            maskImage: "radial-gradient(80% 60% at 50% 30%, #000 15%, transparent 76%)",
            WebkitMaskImage: "radial-gradient(80% 60% at 50% 30%, #000 15%, transparent 76%)",
          }}
        />
        <div
          data-parallax="orb-a"
          className="absolute -left-24 top-10 h-[30rem] w-[30rem] rounded-full bg-blue-light/15 blur-[130px] rm-static"
        />
        <div
          data-parallax="orb-b"
          className="absolute -right-16 top-40 h-[26rem] w-[26rem] rounded-full bg-orange/15 blur-[120px] rm-static"
        />
      </div>

      <div className="shell grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* --- Copy column --- */}
        <motion.div
          data-parallax="copy"
          className="relative z-10 text-center lg:text-start rm-static"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
          {[
            <span key="badge" className="eyebrow">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange" />
              </span>
              {t("hero.badge")}
            </span>,

            <h1
              key="title"
              className="mt-6 font-display text-[2.55rem] font-bold leading-[1.06] tracking-[-0.03em]
                sm:text-6xl lg:text-[4.1rem]"
            >
              {t("hero.title.a")}{" "}
              <span className="text-gradient">{t("hero.title.b")}</span>
              <br className="hidden sm:block" /> {t("hero.title.c")}
            </h1>,

            <p
              key="sub"
              className="mx-auto mt-6 max-w-xl font-body text-[16.5px] leading-relaxed text-white/60
                lg:mx-0 lg:text-[17.5px]"
            >
              {t("hero.subtitle")}
            </p>,

            <div key="cta" className="mt-9 flex flex-col items-center gap-4 lg:items-start">
              <StoreBadges />
              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2 font-body text-[14.5px] font-medium
                  text-white/60 transition-colors duration-300 hover:text-ink"
              >
                {t("hero.cta.secondary")}
                <IconArrowRight className="h-4 w-4 text-orange transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
            </div>,

            <div
              key="trust"
              className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start"
            >
              {trustPoints.map(({ Icon, key }) => (
                <span
                  key={key}
                  className="group inline-flex items-center gap-2 font-body text-[13px] text-white/50
                    transition-colors duration-300 hover:text-white/80"
                >
                  <Icon className="h-4 w-4 text-white/35 transition-colors duration-300 group-hover:text-orange" />
                  {t(key)}
                </span>
              ))}
            </div>,
          ].map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: reduced ? 0.3 : 0.7, ease: EASE_BRAND },
                },
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>

        {/* --- Phone column --- */}
        <div
          data-parallax="phone"
          className="relative z-10 rm-static"
          style={{ perspective: 1400 }}
        >
          <motion.div
            className="relative mx-auto w-fit will-transform"
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, y: reduced ? 0 : 50, scale: reduced ? 1 : 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduced ? 0.3 : 1, delay: 0.2, ease: EASE_BRAND }}
          >
            {/* Idle float sits on an inner wrapper so it composes with the
                tilt transform above instead of overwriting it. */}
            <div className={still ? "" : "animate-float"}>
              <PhoneMockup />

              {/* Floating chips beside the device. They used to be pushed
                  forward with translateZ inside a preserve-3d context, which is
                  what dropped them (and sometimes the phone itself) out of the
                  render on Chrome — plain absolute positioning now. */}
              <motion.div
                className="glass-strong absolute -left-20 top-[20%] hidden rounded-lg px-4 py-3 xl:block"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease: EASE_BRAND }}
              >
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/45">
                  {t("app.offers")}
                </p>
                <p className="mt-0.5 font-display text-lg font-bold text-ink">12</p>
              </motion.div>

              <motion.div
                className="glass-strong absolute -right-20 bottom-[22%] hidden rounded-lg px-4 py-3 xl:block"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.95, duration: 0.6, ease: EASE_BRAND }}
              >
                <div className="flex items-center gap-2">
                  <IconExchange className="h-4 w-4 text-orange" />
                  <div>
                    <p className="font-display text-[13px] font-bold leading-none text-ink">
                      4.8★
                    </p>
                    <p className="mt-1 font-body text-[9.5px] text-white/45">248 trocs</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Ground shadow under the device. */}
          <div className="pointer-events-none absolute inset-x-10 bottom-0 h-24 rounded-[50%] bg-navy/15 blur-[60px]" />
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="mt-16 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="font-body text-[10.5px] uppercase tracking-[0.24em] text-white/40">
          {t("hero.scroll")}
        </span>
        <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            className="block h-1.5 w-1 rounded-full bg-orange"
            animate={reduced ? {} : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </div>
  );
}
