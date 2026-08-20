import type { Config } from "tailwindcss";

/**
 * Every colour here maps to a CSS variable declared in app/globals.css, which
 * mirrors `AppColors` in lib/splash_screen.dart. No hex literal ever appears in
 * a component — change the token once and the whole page follows.
 *
 * `white` is deliberately *overridden* to point at `--fg` (the page's ink
 * navy). The page was authored dark-first, so every surface tint, hairline and
 * muted label is expressed as `white/<alpha>`; re-pointing that one token flips
 * the whole page to the light theme without touching a thousand class names.
 * Anything that must stay literally white (type on an orange button, the splash
 * overlay) uses `pure` instead.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "rgb(var(--fg) / <alpha-value>)",
        pure: "rgb(255 255 255 / <alpha-value>)",
        page: "rgb(var(--surface-page) / <alpha-value>)",
        navy: "rgb(var(--brand-navy) / <alpha-value>)",
        "navy-dark": "rgb(var(--brand-navy-dark) / <alpha-value>)",
        "blue-light": "rgb(var(--brand-blue-light) / <alpha-value>)",
        "blue-soft": "rgb(var(--brand-blue-soft) / <alpha-value>)",
        orange: "rgb(var(--brand-orange) / <alpha-value>)",
        "orange-dark": "rgb(var(--brand-orange-dark) / <alpha-value>)",
        "orange-soft": "rgb(var(--brand-orange-soft) / <alpha-value>)",
        ink: "rgb(var(--surface-ink) / <alpha-value>)",
        "ink-soft": "rgb(var(--surface-ink-soft) / <alpha-value>)",
        mist: "rgb(var(--surface-mist) / <alpha-value>)",
        "text-grey": "rgb(var(--text-grey) / <alpha-value>)",
        success: "rgb(var(--brand-success) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Mirrors AppRadius in the Flutter app, plus the marketing-scale steps.
        sm: "12px",
        md: "18px",
        lg: "24px",
        xl: "28px",
        "2xl": "32px",
        "3xl": "40px",
      },
      maxWidth: {
        shell: "1200px",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -14px, 0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(3%, -4%, 0) scale(1.08)" },
        },
      },
      animation: {
        float: "float 6s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        drift: "drift 18s cubic-bezier(0.45, 0, 0.55, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
