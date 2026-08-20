"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import LanguageSelector from "./LanguageSelector";
import { LogoLockup } from "./Logo";
import { useLocale } from "./LocaleProvider";
import { IconArrowRight } from "./icons/BrandIcons";
import type { Dict } from "@/lib/i18n";
import { EASE_BRAND } from "@/lib/motion";
import { NAV_LINKS, SITE } from "@/lib/site";

export default function Navbar() {
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparent at the very top, frosted once the page moves — the classic
  // Apple/Linear nav behaviour. Passive listener: this runs on every frame of
  // an inertia scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-brand
          ${
            scrolled
              ? "border-b border-white/10 bg-page/90 shadow-[0_10px_30px_-24px_rgb(12_34_68/0.5)] supports-[backdrop-filter:blur(0px)]:bg-page/75 supports-[backdrop-filter:blur(0px)]:backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
      >
        <nav
          className="shell flex items-center justify-between gap-6"
          style={{ height: "var(--nav-h)" }}
          aria-label="Navigation principale"
        >
          <a href="#top" className="shrink-0">
            <LogoLockup idSuffix="nav" />
          </a>

          {/* Centre links — desktop only. */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="group relative block rounded-full px-4 py-2 font-body text-[14px]
                    font-medium text-white/70 transition-colors duration-300 hover:text-ink"
                >
                  {t(`nav.${link.id}` as keyof Dict)}
                  {/* Underline grows from the centre on hover. */}
                  <span
                    className="absolute inset-x-4 bottom-1 h-px origin-center scale-x-0 bg-gradient-to-r
                      from-transparent via-orange to-transparent transition-transform duration-300
                      ease-brand group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            <a
              href={SITE.appStoreUrl}
              className="group hidden items-center gap-2 rounded-full bg-gradient-to-r from-orange
                to-orange-dark px-5 py-2.5 font-body text-[14px] font-semibold text-pure
                shadow-[0_12px_30px_-12px_rgb(var(--brand-orange)/0.8)] transition-all duration-300
                ease-brand will-transform hover:-translate-y-0.5
                hover:shadow-[0_18px_40px_-12px_rgb(var(--brand-orange)/0.95)] sm:inline-flex"
            >
              {t("nav.download")}
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>

            {/* Burger — three rules that morph into a cross. */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t("nav.close") : t("nav.menu")}
              aria-expanded={menuOpen}
              className="relative flex h-11 w-11 items-center justify-center rounded-full
                border border-white/15 bg-white/[0.04] transition-colors duration-300
                hover:border-orange/40 lg:hidden"
            >
              <span className="relative block h-4 w-[18px]">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute left-0 block h-px w-full bg-ink"
                    initial={false}
                    animate={
                      menuOpen
                        ? [
                            { top: 8, rotate: 45, opacity: 1 },
                            { top: 8, opacity: 0, scaleX: 0.2 },
                            { top: 8, rotate: -45, opacity: 1 },
                          ][i]
                        : [
                            { top: 1, rotate: 0, opacity: 1 },
                            { top: 8, opacity: 1, scaleX: 1 },
                            { top: 15, rotate: 0, opacity: 1 },
                          ][i]
                    }
                    transition={{ duration: 0.32, ease: EASE_BRAND }}
                  />
                ))}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile: dimmed backdrop + slide-in glass panel with staggered links. */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.aside
              key="panel"
              className="glass-strong fixed end-0 top-0 z-50 flex h-dvh w-[min(360px,86vw)]
                flex-col gap-8 rounded-s-2xl p-7 pt-24 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: EASE_BRAND }}
            >
              <motion.ul
                className="flex flex-col gap-1"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
                }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.li
                    key={link.id}
                    variants={{
                      hidden: { opacity: 0, x: 28, filter: "blur(6px)" },
                      visible: {
                        opacity: 1,
                        x: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.45, ease: EASE_BRAND },
                      },
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-md px-3 py-3.5
                        font-display text-xl font-semibold text-white/85 transition-colors
                        duration-300 hover:bg-white/[0.05] hover:text-orange"
                    >
                      {t(`nav.${link.id}` as keyof Dict)}
                      <IconArrowRight className="h-4 w-4 text-white/35 rtl:rotate-180" />
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="rule" />

              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45, ease: EASE_BRAND }}
              >
                <LanguageSelector align="start" />
                <a
                  href={SITE.appStoreUrl}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full
                    bg-gradient-to-r from-orange to-orange-dark px-6 py-3.5 font-body
                    text-[15px] font-semibold text-pure
                    shadow-[0_14px_34px_-14px_rgb(var(--brand-orange)/0.9)]"
                >
                  {t("nav.download")}
                  <IconArrowRight className="h-4 w-4 rtl:rotate-180" />
                </a>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
