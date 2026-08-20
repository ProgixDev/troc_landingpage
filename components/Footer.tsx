"use client";

import LanguageSelector from "./LanguageSelector";
import { LogoLockup } from "./Logo";
import { useLocale } from "./LocaleProvider";
import { SOCIALS } from "./Contact";
import type { Dict } from "@/lib/i18n";
import { NAV_LINKS, SITE } from "@/lib/site";

const COLUMNS: { heading: keyof Dict; links: { label: keyof Dict; href: string }[] }[] = [
  {
    heading: "footer.product",
    links: NAV_LINKS.map((link) => ({
      label: `nav.${link.id}` as keyof Dict,
      href: link.href,
    })),
  },
  {
    heading: "footer.company",
    links: [
      { label: "footer.about", href: "#about" },
      { label: "footer.blog", href: "#blog" },
      { label: "footer.careers", href: "#careers" },
      { label: "footer.press", href: "#press" },
    ],
  },
  {
    heading: "footer.legal",
    links: [
      { label: "footer.terms", href: "#terms" },
      { label: "footer.privacy", href: "#privacy" },
      { label: "footer.cookies", href: "#cookies" },
      { label: "footer.legalNotice", href: "#legal" },
    ],
  },
];

export default function Footer() {
  const { t } = useLocale();
  // Fixed at build time — a client-side `new Date()` would risk a hydration
  // mismatch across a midnight boundary.
  const year = 2026;

  return (
    <footer className="relative border-t border-white/10 bg-mist/60">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-8">
          {/* Brand column */}
          <div className="flex flex-col items-start gap-5">
            <LogoLockup idSuffix="footer" />
            <p className="max-w-xs font-body text-[14px] leading-relaxed text-white/55">
              {t("footer.tagline")}
            </p>

            <div className="flex gap-2.5">
              {SOCIALS.map(({ name, href, path }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border
                    border-white/15 bg-pure text-white/60 transition-all duration-500 ease-brand
                    will-transform hover:-translate-y-1 hover:border-orange/40 hover:text-orange"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" fillRule="evenodd" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4">
              <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                {t(column.heading)}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 font-body text-[14px]
                        text-white/65 transition-colors duration-300 hover:text-orange"
                    >
                      <span className="h-px w-0 bg-orange transition-all duration-300 ease-brand group-hover:w-3" />
                      {t(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rule my-10" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-body text-[13px] text-white/50">
            © {year} {SITE.name}. {t("footer.rights")}
          </p>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="font-body text-[13px] text-white/55 transition-colors duration-300 hover:text-orange"
            >
              {SITE.supportEmail}
            </a>
            <LanguageSelector compact />
          </div>
        </div>
      </div>
    </footer>
  );
}
