"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { IconCheck, IconChevronDown, IconGlobe } from "./icons/BrandIcons";
import { useLocale } from "./LocaleProvider";
import { EASE_BRAND } from "@/lib/motion";
import { LOCALES } from "@/lib/site";

type Props = {
  compact?: boolean;
  /**
   * Which edge the menu hangs from. The navbar and footer place the trigger
   * at the right of their row, so it opens leftwards ("end"); the mobile
   * panel stacks it at the left of a column, where "end" would push the menu
   * off the panel.
   */
  align?: "start" | "end";
};

export default function LanguageSelector({ compact = false, align = "end" }: Props) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click and on Escape — a dropdown that traps focus or
  // lingers on scroll is the classic marketing-nav bug.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = LOCALES.find((l) => l.code === locale)!;

  return (
    <div ref={rootRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
        className={`group inline-flex items-center gap-2 rounded-full border border-white/15
          bg-white/[0.04] text-white/70 transition-all duration-300 ease-brand
          hover:border-orange/40 hover:bg-orange/5 hover:text-orange
          ${compact ? "px-3 py-2" : "px-3.5 py-2.5"}`}
      >
        <IconGlobe className="h-[18px] w-[18px] transition-colors duration-300 group-hover:text-orange" />
        <span className="font-body text-[13px] font-semibold tracking-wide">
          {active.native}
        </span>
        <IconChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ease-brand ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.24, ease: EASE_BRAND }}
            className={`glass-strong absolute top-[calc(100%+10px)] z-50 w-48 origin-top
              overflow-hidden rounded-lg p-1.5
              ${align === "start" ? "start-0" : "end-0"}`}
          >
            {LOCALES.map((item) => {
              const selected = item.code === locale;
              return (
                <li key={item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setLocale(item.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5
                      text-start font-body text-sm transition-colors duration-200
                      ${
                        selected
                          ? "bg-orange/15 text-orange"
                          : "text-white/70 hover:bg-white/[0.06] hover:text-ink"
                      }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 font-display text-[11px] font-bold tracking-wider text-white/50">
                        {item.native}
                      </span>
                      {item.label}
                    </span>
                    {selected && <IconCheck className="h-4 w-4 text-orange" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
