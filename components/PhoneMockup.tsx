"use client";

import Image from "next/image";

import screen from "@/public/screens/app-home.jpg";

/**
 * The real product, in a device frame.
 *
 * This used to be a hand-rebuilt fake of the dashboard. It is now the actual
 * app screenshot (assets/landing/, copied to public/screens/app-home.jpg), so
 * what a visitor sees on the site is what they get on their phone.
 *
 * `next/image` with a statically imported file gives us the intrinsic
 * dimensions at build time — the frame reserves the exact aspect ratio, so the
 * image landing can't shift the hero (and can't invalidate every scroll
 * trigger position underneath it).
 */
export default function PhoneMockup() {
  return (
    <div
      className="relative mx-auto w-[276px] rounded-[46px] border border-white/15
        bg-gradient-to-b from-navy-dark to-navy p-[10px]
        shadow-[0_50px_110px_-45px_rgb(12_34_68/0.55)] sm:w-[310px]"
    >
      {/* Screen */}
      <div className="relative overflow-hidden rounded-[38px] bg-mist">
        {/* Notch / dynamic island */}
        <div className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black/85" />

        <Image
          src={screen}
          alt="Écran d'accueil de l'application Troc Travail"
          priority
          sizes="(min-width: 640px) 310px, 276px"
          className="block h-auto w-full"
          placeholder="blur"
        />

        {/* Screen glare — a soft diagonal sheen across the glass. */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[38px]"
          style={{
            background:
              "linear-gradient(128deg, rgb(255 255 255 / 0.18) 0%, transparent 32%, transparent 70%, rgb(255 255 255 / 0.08) 100%)",
          }}
        />
      </div>
    </div>
  );
}
