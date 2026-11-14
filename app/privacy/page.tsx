import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment Troc Travail collecte, utilise et protège vos données personnelles.",
};

const UPDATED_AT = "14 novembre 2026";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-pure pt-32 pb-24">
        <div className="shell max-w-3xl">
          <p className="font-body text-[13px] uppercase tracking-[0.18em] text-navy/45">
            Légal
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] font-semibold text-navy">
            Politique de confidentialité
          </h1>
          <p className="mt-4 font-body text-[15px] text-navy/55">
            Dernière mise à jour : {UPDATED_AT}
          </p>

          <div className="prose-legal mt-12 space-y-10 font-body text-[15px] leading-relaxed text-navy/80">
            <section>
              <p>
                {SITE.name} (« nous ») édite l&apos;application mobile Troc Travail,
                qui permet d&apos;échanger des prestations, des objets ou une
                compensation entre particuliers et professionnels. Cette politique
                décrit quelles données nous collectons dans l&apos;application,
                pourquoi, avec qui elles sont partagées, et comment vous pouvez les
                contrôler.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                1. Données que nous collectons
              </h2>

              <h3 className="mt-5 font-display text-base font-semibold text-navy">
                Compte et profil
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Adresse e-mail et mot de passe (ou identité Google / Apple si
                  vous vous connectez ainsi), prénom, nom
                </li>
                <li>
                  Ville, région, photo de profil, biographie, rayon de
                  déplacement, note et nombre de trocs réalisés
                </li>
              </ul>

              <h3 className="mt-5 font-display text-base font-semibold text-navy">
                Vérification professionnelle (SIRET)
              </h3>
              <p className="mt-2">
                Si vous activez le statut « Pro certifié », votre numéro SIRET est
                vérifié auprès du registre public des entreprises françaises
                (recherche-entreprises.api.gouv.fr). Nous conservons le SIRET, la
                raison sociale associée et la date de vérification.
              </p>

              <h3 className="mt-5 font-display text-base font-semibold text-navy">
                Annonces et échanges
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Titre, description, photos et catégorie des annonces que vous
                  publiez (prestation, objet ou compensation)
                </li>
                <li>
                  Contenu des propositions échangées avec d&apos;autres membres
                </li>
                <li>
                  Messages envoyés dans la messagerie intégrée de
                  l&apos;application
                </li>
              </ul>

              <h3 className="mt-5 font-display text-base font-semibold text-navy">
                Signalements
              </h3>
              <p className="mt-2">
                Si vous signalez un membre ou une annonce, nous conservons le
                motif, les messages échangés avec notre équipe et l&apos;identité
                des parties concernées, afin de traiter le litige.
              </p>

              <h3 className="mt-5 font-display text-base font-semibold text-navy">
                Abonnement et paiement
              </h3>
              <p className="mt-2">
                Les abonnements mensuels et annuels sont traités par Apple
                (App Store), Google (Play Store) via RevenueCat. Nous ne recevons
                et ne stockons jamais vos coordonnées bancaires : uniquement le
                statut de votre abonnement, son identifiant d&apos;achat et son
                historique de renouvellement.
              </p>

              <h3 className="mt-5 font-display text-base font-semibold text-navy">
                Notifications et données techniques
              </h3>
              <p className="mt-2">
                Un jeton d&apos;appareil est enregistré pour vous envoyer des
                notifications push (nouveaux messages, propositions, mises à jour
                de litige) via Firebase Cloud Messaging. Nous n&apos;utilisons
                aucun SDK publicitaire et aucun outil d&apos;analyse
                comportementale tiers.
              </p>

              <h3 className="mt-5 font-display text-base font-semibold text-navy">
                Localisation
              </h3>
              <p className="mt-2">
                L&apos;application n&apos;accède pas à votre position GPS. Seule la
                ville et la région que vous indiquez librement dans votre profil
                sont utilisées pour la recherche d&apos;annonces à proximité.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                2. Pourquoi nous utilisons ces données
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Créer et sécuriser votre compte</li>
                <li>
                  Afficher votre profil et vos annonces aux autres membres, et
                  permettre la mise en relation pour un troc
                </li>
                <li>Certifier un statut professionnel si vous le demandez</li>
                <li>Traiter les signalements et litiges entre membres</li>
                <li>Gérer votre abonnement et son renouvellement</li>
                <li>
                  Vous envoyer des notifications liées à votre activité dans
                  l&apos;application
                </li>
                <li>Assurer la sécurité et prévenir la fraude</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                3. Avec qui nous partageons vos données
              </h2>
              <p className="mt-3">
                Nous ne vendons jamais vos données. Elles sont partagées
                uniquement avec les prestataires nécessaires au fonctionnement de
                l&apos;application :
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Supabase</strong> — hébergement de la base de données,
                  authentification et stockage des photos
                </li>
                <li>
                  <strong>RevenueCat, Apple et Google</strong> — gestion des
                  abonnements et des achats intégrés
                </li>
                <li>
                  <strong>Firebase Cloud Messaging (Google)</strong> — acheminement
                  des notifications push
                </li>
                <li>
                  <strong>recherche-entreprises.api.gouv.fr</strong> — vérification
                  publique des numéros SIRET
                </li>
              </ul>
              <p className="mt-3">
                Les autres membres de l&apos;application voient votre profil
                public, vos annonces et les messages que vous leur envoyez
                directement.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                4. Combien de temps nous conservons vos données
              </h2>
              <p className="mt-3">
                Vos données sont conservées tant que votre compte est actif. Si
                vous supprimez votre compte depuis l&apos;application, votre
                profil, vos annonces et vos messages sont supprimés, à
                l&apos;exception des informations que nous devons conserver pour
                des raisons légales ou pour l&apos;instruction d&apos;un litige en
                cours.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                5. Vos droits
              </h2>
              <p className="mt-3">
                Conformément au RGPD, vous pouvez à tout moment demander
                l&apos;accès, la rectification, l&apos;export ou la suppression de
                vos données, ou vous opposer à leur traitement. Vous pouvez gérer
                la plupart de ces actions directement depuis votre profil dans
                l&apos;application, ou nous écrire à{" "}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="text-orange underline-offset-2 hover:underline"
                >
                  {SITE.supportEmail}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                6. Mineurs
              </h2>
              <p className="mt-3">
                Troc Travail n&apos;est pas destiné aux personnes de moins de 16
                ans. Nous ne collectons pas sciemment de données concernant des
                mineurs.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                7. Modifications de cette politique
              </h2>
              <p className="mt-3">
                Nous pouvons mettre à jour cette politique de confidentialité. En
                cas de changement important, nous vous en informerons dans
                l&apos;application avant qu&apos;il ne prenne effet.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-navy">
                8. Nous contacter
              </h2>
              <p className="mt-3">
                Pour toute question relative à cette politique ou à vos données
                personnelles :{" "}
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="text-orange underline-offset-2 hover:underline"
                >
                  {SITE.supportEmail}
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
