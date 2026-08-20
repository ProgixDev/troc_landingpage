"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Kept for call-site compatibility — there is no exit animation any more. */
  noExit?: boolean;
};

/**
 * The section reveal: each section rises and fades in once, the first time it
 * comes into view, then is left completely alone.
 *
 * What this replaced, and why:
 *
 *  - It used to run two *scrubbed* GSAP timelines per section — an entering
 *    one (y / rotateX / translateZ / opacity / blur) and a leaving one
 *    (scale 0.93 / opacity 0.28 / blur 9px). Their trigger windows overlap on
 *    any section shorter than ~1.6 viewports, so on a normal-length section
 *    the exit tween won the property fight and the section sat at 28 % opacity
 *    behind a blur — the third feature card, the stats panel and the pricing
 *    cards "disappearing" were all this.
 *  - Scrubbing `filter: blur()` and `scale` across a full section repaints the
 *    entire subtree every frame, and `will-change: transform, opacity, filter`
 *    on all six sections kept six full-page compositor layers alive at once.
 *    That is the lag, and the out-of-memory tab crash on mobile.
 *  - The 3D plane (`perspective` + `preserve-3d`) around cards that used
 *    `backdrop-filter` is a known blank-render combination in Chromium and
 *    WebKit; the cards are opaque now and the 3D context is gone.
 *
 * An IntersectionObserver is all this needs, and it cannot get stranded: the
 * class is only ever added, and anything already on screen at mount is
 * revealed immediately.
 */
export default function DepthSection({ children, id, className = "" }: Props) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    // No IntersectionObserver (or reduced motion): show it, don't animate it.
    if (typeof IntersectionObserver === "undefined") {
      inner.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      // Fires as soon as any sliver is on screen, so a fast flick can never
      // outrun it, and never waits for a percentage a tall section can't reach.
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(inner);

    // Safety net: if the observer somehow never fires (bfcache restore, a
    // resize during load, a section already scrolled past on a deep link),
    // the content must still end up visible rather than stuck at opacity 0.
    const failsafe = window.setTimeout(() => inner.classList.add("is-visible"), 2500);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <section id={id} className={className}>
      <div ref={innerRef} className="reveal">
        {children}
      </div>
    </section>
  );
}
