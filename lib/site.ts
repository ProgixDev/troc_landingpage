/**
 * Product facts shared by every section. These mirror the Flutter app:
 * plan prices come from lib/subscription_plans.dart, the category count
 * from lib/prestations_catalog.dart. Keep them in sync by hand — the two
 * codebases don't share a build.
 */

export const SITE = {
  name: "Troc Travail",
  tagline: "Échangez ce que vous savez faire contre ce dont vous avez besoin",
  supportEmail: "contact@troctravail.fr",
  appStoreUrl: "#appstore",
  playStoreUrl: "#playstore",
} as const;

export const NAV_LINKS = [
  { id: "features", href: "#features" },
  { id: "how", href: "#how-it-works" },
  { id: "pricing", href: "#pricing" },
  { id: "contact", href: "#contact" },
] as const;

export type LocaleCode = "fr" | "en" | "ar";

export const LOCALES: {
  code: LocaleCode;
  label: string;
  native: string;
  dir: "ltr" | "rtl";
}[] = [
  { code: "fr", label: "Français", native: "FR", dir: "ltr" },
  { code: "en", label: "English", native: "EN", dir: "ltr" },
  { code: "ar", label: "العربية", native: "AR", dir: "rtl" },
];

/** The three things a member can put on the table — the app's core model. */
export const TRADE_MODES = ["prestation", "objet", "compensation"] as const;
export type TradeMode = (typeof TRADE_MODES)[number];

/** Prices are the source values from kMonthlyPlan / kAnnualPlan. */
export const PLANS = [
  { id: "free", price: 0, period: "always", featured: false },
  { id: "monthly", price: 2.99, period: "month", featured: true },
  { id: "annual", price: 10.99, period: "year", featured: false },
] as const;

export const STEPS = ["onboarding", "publish", "negotiate", "trade", "rate"] as const;

export const STATS = [
  { id: "trades", value: 10000, suffix: "+" },
  { id: "categories", value: 50, suffix: "+" },
  { id: "rating", value: 4.8, suffix: "★", decimals: 1 },
  { id: "cities", value: 120, suffix: "+" },
] as const;

/** French comma decimal, matching SubscriptionPlan.formattedPrice. */
export function formatPrice(value: number, locale: LocaleCode) {
  if (value === 0) return "0";
  const fixed = value.toFixed(2);
  return locale === "fr" ? fixed.replace(".", ",") : fixed;
}
