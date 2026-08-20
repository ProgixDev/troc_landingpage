type Props = {
  className?: string;
  /** Unique per instance: the gradient <defs> id must not collide when the
   *  logo is rendered more than once on the page. */
  idSuffix?: string;
};

/**
 * The app's logo mark, ported from assets/branding/logo_mark.svg — same badge
 * gradient (navy → blue → orange) and the same exchange-arrows glyph.
 */
export default function LogoMark({ className = "h-10 w-10", idSuffix = "a" }: Props) {
  const gradientId = `troc-badge-${idSuffix}`;
  const glowId = `troc-glow-${idSuffix}`;

  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--brand-navy))" }} />
          <stop offset="0.55" style={{ stopColor: "rgb(var(--brand-blue-light))" }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--brand-orange))" }} />
        </linearGradient>
        {/* Soft top-left sheen so the badge reads as glass, not flat fill. */}
        <radialGradient id={glowId} cx="0.3" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="4" y="4" width="152" height="152" rx="36" fill={`url(#${gradientId})`} />
      <rect x="4" y="4" width="152" height="152" rx="36" fill={`url(#${glowId})`} />
      <rect
        x="4.75"
        y="4.75"
        width="150.5"
        height="150.5"
        rx="35.25"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />

      <g
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M46 62 H108" />
        <path d="M92 46 L110 62 L92 78" />
        <path d="M114 98 H52" />
        <path d="M68 82 L50 98 L68 114" />
      </g>
    </svg>
  );
}

/** Logo mark + wordmark, used in the navbar and footer. */
export function LogoLockup({
  className = "",
  idSuffix = "lockup",
}: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9" idSuffix={idSuffix} />
      <span className="font-display text-[17px] font-bold leading-none tracking-tight text-ink">
        Troc<span className="text-orange">&nbsp;Travail</span>
      </span>
    </span>
  );
}
