/**
 * Custom thin-stroke icon set, drawn on a 24px grid with a uniform 1.5
 * stroke-width, round caps and round joins — the Linear/Stripe marketing
 * register. They inherit `currentColor` so a parent's `text-*` class tints
 * them, including on hover.
 *
 * Phosphor (weight="light") is used for the incidental UI glyphs elsewhere;
 * these are the ones that carry brand meaning and needed to be drawn.
 */

export type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function Svg({
  className = "h-6 w-6",
  strokeWidth = 1.5,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** Two arrows swapping direction — the app's core "troc" gesture. */
export function IconExchange(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 8.5h14" />
      <path d="M14 5l3.5 3.5L14 12" />
      <path d="M20.5 15.5h-14" />
      <path d="M10 12l-3.5 3.5L10 19" />
    </Svg>
  );
}

/** Open-jaw wrench — a hands-on service. */
export function IconService(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.9 6.2a1 1 0 0 0 0 1.4l1.5 1.5a1 1 0 0 0 1.4 0l3.5-3.5a5.6 5.6 0 0 1-7.4 7.4l-6.5 6.5a2 2 0 0 1-2.8-2.8l6.5-6.5a5.6 5.6 0 0 1 7.4-7.4Z" />
    </Svg>
  );
}

/** An open parcel — the "objet" side of a trade. */
export function IconGoods(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.9 20.5 7v10L12 21.1 3.5 17V7Z" />
      <path d="M3.7 7.1 12 11.4l8.3-4.3" />
      <path d="M12 11.4V21" />
      <path d="M7.7 4.9 16 9.2" />
    </Svg>
  );
}

/** Balance scale — the cash top-up that levels an uneven trade. */
export function IconBalance(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.2v15.4" />
      <path d="M7 19.6h10" />
      <path d="M4.6 7.6h14.8" />
      <path d="M4.6 7.6 2.2 13.4h4.8Z" />
      <path d="M2.2 13.4a2.4 2.4 0 0 0 4.8 0" />
      <path d="m19.4 7.6-2.4 5.8h4.8Z" />
      <path d="M17 13.4a2.4 2.4 0 0 0 4.8 0" />
      <circle cx="12" cy="5" r="1.4" />
    </Svg>
  );
}

/** Map pin with a hollow centre — geolocated search. */
export function IconPin(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 21.2c3.7-4 5.6-7 5.6-9.4a5.6 5.6 0 1 0-11.2 0c0 2.4 1.9 5.4 5.6 9.4Z" />
      <circle cx="12" cy="11.4" r="2.1" />
    </Svg>
  );
}

/** Chat bubble with a reply tail — the built-in messenger. */
export function IconChat(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20.4 12.4c0 3.7-3.6 6.6-8 6.6a9.6 9.6 0 0 1-2.6-.35L5 20.4l1.1-3.3a6.3 6.3 0 0 1-2.5-4.7c0-3.7 3.6-6.6 8-6.6s8.8 2.9 8.8 6.6Z" />
      <path d="M8.6 11.6h6.8" />
      <path d="M8.6 14.2h4.2" />
    </Svg>
  );
}

/** Five-point star, single path — used by the ratings step. */
export function IconStar(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3.6 2.55 5.4 5.75.83-4.16 4.16.98 5.9L12 17.1l-5.12 2.79.98-5.9L3.7 9.83l5.75-.83Z" />
    </Svg>
  );
}

/** Person inside a rounded frame — profile / onboarding. */
export function IconProfile(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="9.2" r="3.3" />
      <path d="M5.4 19.6a6.8 6.8 0 0 1 13.2 0" />
      <rect x="3" y="3" width="18" height="18" rx="6" />
    </Svg>
  );
}

/** Square with a plus — publishing a listing. */
export function IconPublish(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.6" />
      <path d="M12 8.3v7.4" />
      <path d="M8.3 12h7.4" />
    </Svg>
  );
}

/** Layered sheets — the structured catalogue. */
export function IconLayers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3.4 8.4 4.2-8.4 4.2-8.4-4.2Z" />
      <path d="m3.6 12 8.4 4.2 8.4-4.2" />
      <path d="m3.6 16.4 8.4 4.2 8.4-4.2" />
    </Svg>
  );
}

/** Shield with a tick — trust and reputation. */
export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.2 19.2 6v5.7c0 4.1-2.8 7.4-7.2 9.1-4.4-1.7-7.2-5-7.2-9.1V6Z" />
      <path d="m9.2 12 2 2 3.6-3.9" />
    </Svg>
  );
}

/** Bare checkmark for list bullets and the selected-card badge. */
export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4.8 12.6 4.5 4.5L19.2 7.2" />
    </Svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 12h15" />
      <path d="m13 5.5 6.5 6.5L13 18.5" />
    </Svg>
  );
}

export function IconGlobe(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.2c2.2 2.4 3.4 5.4 3.4 8.8s-1.2 6.4-3.4 8.8c-2.2-2.4-3.4-5.4-3.4-8.8S9.8 5.6 12 3.2Z" />
    </Svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </Svg>
  );
}
