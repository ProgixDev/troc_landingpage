import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Suppression de compte",
  description:
    "Comment supprimer votre compte Troc Travail et vos données, dans l'application ou par e-mail.",
};

const UPDATED_AT = "14 novembre 2026";
const DELETE_SUBJECT = encodeURIComponent("Suppression de mon compte Troc Travail");
const DELETE_BODY = encodeURIComponent(
  "Bonjour,\n\nJe souhaite supprimer mon compte Troc Travail et mes données.\n\nAdresse e-mail du compte : \n\nMerci.",
);
const mailtoDelete = `mailto:${SITE.supportEmail}?subject=${DELETE_SUBJECT}&body=${DELETE_BODY}`;

export default function DeleteAccountPage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-pure pt-32 pb-24">
        <div className="shell max-w-3xl">
          <p className="font-body text-[13px] uppercase tracking-[0.18em] text-navy/45">
            Légal
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold text-navy">
            Suppression de compte
          </h1>
          <p className="mt-4 font-body text-[15px] text-navy/55">
            Dernière mise à jour : {UPDATED_AT}
          </p>

          <div className="mt-12 space-y-10 font-body text-[15px] leading-relaxed text-navy/80">
            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                Depuis l&apos;application (immédiat)
              </h2>
              <p className="mt-3">
                Si vous avez accès à l&apos;application, c&apos;est le moyen le
                plus rapide : ouvrez Troc Travail, allez dans{" "}
                <strong>Profil → Confidentialité / Paramètres</strong>, puis
                appuyez sur <strong>« Supprimer mon compte »</strong> en bas de
                l&apos;écran et confirmez. La suppression est immédiate et
                définitive.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                Sans l&apos;application
              </h2>
              <p className="mt-3">
                Si vous n&apos;avez plus l&apos;application installée ou n&apos;y
                avez pas accès, vous pouvez demander la suppression par
                e-mail à{" "}
                <a
                  href={mailtoDelete}
                  className="text-orange underline-offset-2 hover:underline"
                >
                  {SITE.supportEmail}
                </a>{" "}
                en indiquant l&apos;adresse e-mail associée à votre compte.
                Nous vérifions votre identité avant de traiter la demande, et
                la suppression est effectuée sous 30 jours maximum.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                Ce qui est supprimé
              </h2>
              <p className="mt-3">
                Votre profil, vos annonces et leurs photos, vos messages et
                propositions, vos évaluations, votre statut professionnel
                (SIRET) et l&apos;historique de votre abonnement sont
                définitivement supprimés de nos serveurs.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                Ce qui peut être conservé
              </h2>
              <p className="mt-3">
                Certaines données peuvent être conservées au-delà de la
                suppression de votre compte lorsque la loi nous y oblige —
                notamment les factures et justificatifs comptables liés à un
                abonnement payé, conservés pour la durée légale requise, ainsi
                que les informations strictement nécessaires à la résolution
                d&apos;un litige en cours au moment de la demande.
              </p>
            </section>

            <section>
              <p>
                Pour le détail complet du traitement de vos données, consultez
                notre{" "}
                <a
                  href="/privacy"
                  className="text-orange underline-offset-2 hover:underline"
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
