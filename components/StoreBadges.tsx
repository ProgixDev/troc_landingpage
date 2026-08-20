"use client";

import { SITE } from "@/lib/site";

/**
 * The two official store badges, reproduced as inline SVG so they stay crisp
 * at any size and can inherit the page's hover motion. Both follow the
 * vendors' marketing guidelines: black lozenge, white rule, the small
 * "Download on the / GET IT ON" line above the wordmark, and Apple's and
 * Google's own marks — never a redrawn or icon-pack substitute.
 */

function AppStoreBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 60"
      role="img"
      aria-label="Download on the App Store"
      className={className}
      style={{ direction: "ltr" }}
    >
      <rect
        x="0.75"
        y="0.75"
        width="178.5"
        height="58.5"
        rx="10.5"
        fill="#000"
        stroke="#A6A6A6"
        strokeWidth="1.5"
      />
      {/* Apple mark */}
      <path
        fill="#fff"
        d="M35.9 30.5c0-3.2 2.6-4.8 2.7-4.9-1.5-2.2-3.8-2.5-4.6-2.5-1.9-.2-3.8 1.2-4.8 1.2-1 0-2.5-1.1-4.1-1.1-2.1 0-4 1.2-5.1 3.1-2.2 3.8-.6 9.3 1.5 12.4 1.1 1.5 2.3 3.1 4 3.1 1.6-.1 2.2-1 4.1-1 1.9 0 2.5 1 4.1 1 1.7 0 2.8-1.5 3.8-3 1.2-1.7 1.7-3.4 1.7-3.5-.1 0-3.3-1.3-3.3-4.8Zm-3.1-9c.8-1.1 1.4-2.5 1.3-3.9-1.3.1-2.9.9-3.8 1.9-.8.9-1.5 2.4-1.3 3.8 1.4.1 2.9-.7 3.8-1.8Z"
      />
      <text
        x="49"
        y="24"
        fill="#fff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="10"
        letterSpacing="0.4"
      >
        Download on the
      </text>
      <text
        x="48.4"
        y="43"
        fill="#fff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="20"
        fontWeight="500"
        letterSpacing="-0.3"
      >
        App Store
      </text>
    </svg>
  );
}

function GooglePlayBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 60"
      role="img"
      aria-label="Get it on Google Play"
      className={className}
      style={{ direction: "ltr" }}
    >
      <defs>
        {/* The four facets of Google's play triangle, each its own gradient. */}
        <linearGradient id="gp-blue" x1="0.6" y1="0.06" x2="-0.5" y2="0.62">
          <stop offset="0" stopColor="#00A0FF" />
          <stop offset="0.26" stopColor="#00A1FF" />
          <stop offset="0.66" stopColor="#00BEFF" />
          <stop offset="1" stopColor="#00C0FF" />
        </linearGradient>
        <linearGradient id="gp-yellow" x1="1.08" y1="0.5" x2="-1.31" y2="0.5">
          <stop offset="0" stopColor="#FFE000" />
          <stop offset="0.41" stopColor="#FFBD00" />
          <stop offset="0.78" stopColor="#FFA500" />
          <stop offset="1" stopColor="#FF9C00" />
        </linearGradient>
        <linearGradient id="gp-red" x1="0.86" y1="0.18" x2="-0.5" y2="1.95">
          <stop offset="0" stopColor="#FF3A44" />
          <stop offset="1" stopColor="#C31162" />
        </linearGradient>
        <linearGradient id="gp-green" x1="-0.19" y1="-0.54" x2="0.42" y2="0.69">
          <stop offset="0" stopColor="#32A071" />
          <stop offset="0.07" stopColor="#2DA771" />
          <stop offset="0.48" stopColor="#15CF74" />
          <stop offset="1" stopColor="#00E576" />
        </linearGradient>
      </defs>

      <rect
        x="0.75"
        y="0.75"
        width="178.5"
        height="58.5"
        rx="10.5"
        fill="#000"
        stroke="#A6A6A6"
        strokeWidth="1.5"
      />

      <g transform="translate(15 15) scale(0.0555)">
        <path
          fill="url(#gp-blue)"
          d="M20.7 9.5c-1.6 1.7-2.5 4.3-2.5 7.7v285.6c0 3.4.9 6 2.5 7.7l1 .9 160-160v-3.8l-160-160-1 .9Z"
        />
        <path
          fill="url(#gp-yellow)"
          d="m235 205.1-53.3-53.3v-3.8l53.3-53.4 1.2.7 63.2 35.9c18 10.2 18 27 0 37.3l-63.2 35.9-1.2.7Z"
        />
        <path
          fill="url(#gp-red)"
          d="M236.2 204.4 181.7 149.9 20.7 310.9c5.9 6.3 15.7 7 26.8.8l188.7-107.3"
        />
        <path
          fill="url(#gp-green)"
          d="M236.2 95.4 47.5 -11.8c-11.1-6.3-20.9-5.5-26.8.8l161 161 54.5-54.6Z"
        />
      </g>

      <text
        x="55"
        y="24"
        fill="#fff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="9.5"
        letterSpacing="1.1"
      >
        GET IT ON
      </text>
      <text
        x="54.4"
        y="44"
        fill="#fff"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="20"
        fontWeight="500"
        letterSpacing="-0.2"
      >
        Google Play
      </text>
    </svg>
  );
}

type Props = {
  /** `lg` is the hero pair; `sm` is the footer/banner pair. */
  size?: "sm" | "lg";
  className?: string;
};

export default function StoreBadges({ size = "lg", className = "" }: Props) {
  const height = size === "lg" ? "h-[58px]" : "h-[50px]";

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {[
        { href: SITE.appStoreUrl, Badge: AppStoreBadge, key: "ios" },
        { href: SITE.playStoreUrl, Badge: GooglePlayBadge, key: "android" },
      ].map(({ href, Badge, key }) => (
        <a
          key={key}
          href={href}
          className="group/badge rounded-[11px] transition-transform duration-300 ease-brand
            will-transform hover:-translate-y-1 focus-visible:-translate-y-1"
        >
          <Badge
            className={`${height} w-auto rounded-[11px] shadow-[0_10px_28px_-14px_rgb(12_34_68/0.6)]
              transition-shadow duration-300 ease-brand
              group-hover/badge:shadow-[0_20px_44px_-16px_rgb(var(--brand-orange)/0.55)]`}
          />
        </a>
      ))}
    </div>
  );
}
