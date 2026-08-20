"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SectionHeading from "./SectionHeading";
import { useLocale } from "./LocaleProvider";
import { IconArrowRight, IconChat, IconCheck, IconPin, IconShield } from "./icons/BrandIcons";
import type { Dict } from "@/lib/i18n";
import { EASE_BRAND, revealVariants, staggerVariants, useReducedMotion, VIEWPORT } from "@/lib/motion";
import { SITE } from "@/lib/site";

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * A floating-label field. The label sits inside the input at rest and lifts
 * into the border when the field is focused or filled — driven by the
 * `peer-focus` / `peer-[:not(:placeholder-shown)]` pair, so no JS tracks it.
 * The single-space placeholder is what makes `:placeholder-shown` meaningful.
 */
function FloatingField({
  id,
  label,
  type = "text",
  value,
  error,
  multiline = false,
  onChange,
}: {
  id: Field;
  label: string;
  type?: string;
  value: string;
  error?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  const shared = `peer w-full rounded-md border bg-white/[0.03] px-4 pb-2.5 pt-6 font-body
    text-[15px] text-ink outline-none transition-all duration-300 ease-brand
    placeholder:text-transparent focus:bg-pure
    ${
      error
        ? "border-orange/60 focus:border-orange focus:shadow-[0_0_0_4px_rgb(var(--brand-orange)/0.12)]"
        : "border-white/15 focus:border-orange/50 focus:shadow-[0_0_0_4px_rgb(var(--brand-orange)/0.1)]"
    }`;

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} resize-none`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      <label
        htmlFor={id}
        className="pointer-events-none absolute start-4 top-4 font-body text-[15px] text-white/50
          transition-all duration-300 ease-brand
          peer-focus:top-2 peer-focus:text-[11px] peer-focus:tracking-wide peer-focus:text-orange
          peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]
          peer-[:not(:placeholder-shown)]:tracking-wide peer-[:not(:placeholder-shown)]:text-white/50"
      >
        {label}
      </label>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_BRAND }}
            className="ps-1 pt-1.5 font-body text-[12px] text-orange"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const { t } = useLocale();
  const reduced = useReducedMotion();

  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  // Bumped on a failed submit to re-key the shake animation.
  const [shake, setShake] = useState(0);

  const setField = (field: Field) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear the error as soon as the visitor starts fixing it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const next: Partial<Record<Field, string>> = {};
    if (values.name.trim().length < 2) next.name = t("contact.error.name");
    if (!EMAIL_RE.test(values.email.trim())) next.email = t("contact.error.email");
    if (values.message.trim().length < 12) next.message = t("contact.error.message");

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setShake((n) => n + 1);
      return;
    }

    // No backend on the marketing site — this is the optimistic UI only.
    // Point it at your form endpoint when one exists.
    setStatus("sending");
    window.setTimeout(() => setStatus("sent"), 1100);
  };

  const channels = [
    { Icon: IconChat, label: t("contact.support"), value: SITE.supportEmail, href: `mailto:${SITE.supportEmail}` },
    { Icon: IconShield, label: t("footer.privacy"), value: "RGPD · France", href: "#privacy" },
    { Icon: IconPin, label: t("features.prestation.point3"), value: "Lyon, France", href: "#top" },
  ];

  return (
    <div className="shell py-24 sm:py-28 lg:py-32">
      <SectionHeading
        eyebrow={t("contact.eyebrow")}
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      />

      <motion.div
        className="mt-14 grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={staggerVariants(0.12)}
      >
        {/* --- Form --- */}
        <motion.div variants={revealVariants(reduced, 30)}>
          <motion.form
            key={shake}
            onSubmit={handleSubmit}
            noValidate
            animate={
              shake > 0 && !reduced ? { x: [0, -9, 8, -5, 0] } : {}
            }
            transition={{ duration: 0.42, ease: "easeInOut" }}
            className="glass relative flex flex-col gap-4 rounded-2xl p-7 lg:p-9"
          >
            <FloatingField
              id="name"
              label={t("contact.name")}
              value={values.name}
              error={errors.name}
              onChange={setField("name")}
            />
            <FloatingField
              id="email"
              type="email"
              label={t("contact.email")}
              value={values.email}
              error={errors.email}
              onChange={setField("email")}
            />
            <FloatingField
              id="message"
              label={t("contact.message")}
              value={values.message}
              error={errors.message}
              multiline
              onChange={setField("message")}
            />

            <button
              type="submit"
              disabled={status !== "idle"}
              className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full
                bg-gradient-to-r from-orange to-orange-dark px-7 py-4 font-body text-[15px]
                font-semibold text-pure shadow-[0_16px_40px_-16px_rgb(var(--brand-orange)/0.95)]
                transition-all duration-300 ease-brand will-transform
                hover:-translate-y-0.5 disabled:cursor-default disabled:opacity-80
                disabled:hover:translate-y-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={status}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="inline-flex items-center gap-2"
                >
                  {status === "idle" && (
                    <>
                      {t("contact.send")}
                      <IconArrowRight className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </>
                  )}
                  {status === "sending" && (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-pure/40 border-t-pure" />
                      {t("contact.sending")}
                    </>
                  )}
                  {status === "sent" && (
                    <>
                      <IconCheck className="h-4 w-4" strokeWidth={2.4} />
                      {t("contact.sent")}
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </motion.form>
        </motion.div>

        {/* --- Channels + socials --- */}
        <motion.div variants={revealVariants(reduced, 30)} className="flex flex-col gap-5">
          <div className="glass flex flex-col gap-1 rounded-2xl p-7 lg:p-8">
            {channels.map(({ Icon, label, value, href }, i) => (
              <a
                key={label}
                href={href}
                className={`group flex items-center gap-4 py-4 transition-colors duration-300
                  ${i > 0 ? "border-t border-white/10" : ""}`}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md
                    border border-white/15 bg-white/[0.04] text-white/65 transition-all duration-500
                    ease-brand group-hover:border-orange/35 group-hover:bg-orange/5 group-hover:text-orange"
                >
                  <Icon className="h-5 w-5 transition-transform duration-500 ease-brand group-hover:scale-110" />
                </span>
                <span className="min-w-0">
                  <span className="block font-body text-[11px] uppercase tracking-[0.16em] text-white/45">
                    {label}
                  </span>
                  <span className="mt-0.5 block truncate font-body text-[14.5px] font-medium text-white/85 transition-colors duration-300 group-hover:text-orange">
                    {value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="glass rounded-2xl p-7 lg:p-8">
            <p className="font-body text-[11px] uppercase tracking-[0.16em] text-white/45">
              {t("contact.social")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {SOCIALS.map(({ name, href, path }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="group flex h-11 w-11 items-center justify-center rounded-full
                    border border-white/15 bg-white/[0.04] text-white/60 transition-all duration-500
                    ease-brand will-transform hover:-translate-y-1 hover:border-orange/40
                    hover:bg-orange/5 hover:text-orange"
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" fillRule="evenodd" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Brand glyphs, kept as filled paths — the platforms' own marks. */
export const SOCIALS = [
  {
    name: "Instagram",
    href: "#instagram",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 5.19a4.65 4.65 0 1 0 0 9.3 4.65 4.65 0 0 0 0-9.3Zm0 7.67a3.02 3.02 0 1 1 0-6.04 3.02 3.02 0 0 1 0 6.04Zm5.92-7.85a1.09 1.09 0 1 1-2.17 0 1.09 1.09 0 0 1 2.17 0Z",
  },
  {
    name: "LinkedIn",
    href: "#linkedin",
    path: "M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75v5.7h-4v-5.05c0-1.2-.02-2.75-1.75-2.75-1.75 0-2.02 1.3-2.02 2.66v5.14h-4v-11Z",
  },
  {
    name: "X",
    href: "#x",
    path: "M17.53 3h3.02l-6.6 7.54L21.75 21h-6.06l-4.75-6.2L5.5 21H2.47l7.05-8.06L2.25 3h6.2l4.3 5.68L17.53 3Zm-1.06 16.2h1.67L7.6 4.7H5.8l10.67 14.5Z",
  },
  {
    name: "TikTok",
    href: "#tiktok",
    path: "M16.6 5.82a4.83 4.83 0 0 1-1.12-2.82h-3.1v11.6a2.47 2.47 0 1 1-1.98-2.42V9.05a5.55 5.55 0 1 0 5.08 5.53V8.9a7.8 7.8 0 0 0 4.52 1.45V7.25a4.8 4.8 0 0 1-3.4-1.43Z",
  },
] as const;
