"use client";

import { CheckCircle, EnvelopeSimple, WarningCircle } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { LogoLockup } from "@/components/Logo";

/**
 * Supabase completes a PKCE email-confirmation request before redirecting
 * here. The returned `code` is therefore evidence of a completed
 * confirmation—not a credential this page needs to exchange. The app is
 * opened separately so the member can sign in normally.
 */
export default function ConfirmPage() {
  return (
    <Suspense fallback={<ConfirmationShell><ConfirmationLoading /></ConfirmationShell>}>
      <ConfirmContent />
    </Suspense>
  );
}

function ConfirmContent() {
  const searchParams = useSearchParams();
  const isConfirmed = Boolean(searchParams.get("code"));

  return (
    <ConfirmationShell>
      {isConfirmed ? <ConfirmationSuccess /> : <ConfirmationError />}
    </ConfirmationShell>
  );
}

function ConfirmationShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-page px-5 py-10">
      <div
        className="pointer-events-none absolute -left-36 -top-32 h-96 w-96 rounded-full bg-blue-light/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-orange/10 blur-3xl"
        aria-hidden="true"
      />

      <section className="glass-strong relative w-full max-w-md rounded-3xl px-6 py-9 text-center sm:px-10 sm:py-11">
        <LogoLockup className="justify-center" idSuffix="confirm" />
        {children}
      </section>
    </main>
  );
}

function ConfirmationLoading() {
  return (
    <>
      <span className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-full bg-blue-light/10 text-blue-light">
        <EnvelopeSimple size={34} weight="duotone" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Vérification en cours…</h1>
      <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
        Nous vérifions votre adresse email.
      </p>
    </>
  );
}

function ConfirmationSuccess() {
  return (
    <>
      <span className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
        <CheckCircle size={36} weight="fill" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Email confirmé !</h1>
      <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
        Votre adresse email est vérifiée. Vous pouvez maintenant vous connecter à
        Troc Travail.
      </p>

      <a
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange px-5 py-3 text-sm font-bold text-pure shadow-[0_14px_28px_-16px_rgb(var(--brand-orange)/0.9)] transition hover:bg-orange-dark"
        href="com.troc.travail://login-callback?confirmed=true"
      >
        Ouvrir l&apos;application
      </a>
      <p className="mt-5 text-xs leading-5 text-text-grey">
        Vous n&apos;avez pas encore l&apos;application ? Téléchargez Troc Travail
        depuis votre boutique d&apos;applications.
      </p>
    </>
  );
}

function ConfirmationError() {
  return (
    <>
      <span className="mx-auto mt-10 grid h-16 w-16 place-items-center rounded-full bg-orange/10 text-orange">
        <WarningCircle size={36} weight="fill" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Lien invalide</h1>
      <p className="mt-3 text-sm leading-6 text-white/60 sm:text-base">
        Ce lien de confirmation est invalide ou a expiré. Retournez dans
        l&apos;application pour demander un nouvel email.
      </p>
      <a
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-light/25 bg-blue-soft px-5 py-3 text-sm font-bold text-navy transition hover:bg-blue-light/15"
        href="com.troc.travail://login-callback"
      >
        <EnvelopeSimple size={19} weight="bold" aria-hidden="true" />
        Ouvrir l&apos;application
      </a>
    </>
  );
}
