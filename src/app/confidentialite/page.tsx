import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { business } from "@/config/site";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <>
      <main className="bg-night px-4 pb-20 pt-16 text-ivory sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange hover:text-orange-hover">
            <ArrowLeft size={16} aria-hidden />
            Retour au site
          </Link>
          <h1 className="section-title mt-8 text-4xl sm:text-5xl">
            Politique de confidentialité
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-ivory/75">
            <section>
              <h2 className="mb-2 text-base font-extrabold uppercase tracking-wide text-ivory">Données collectées</h2>
              <p>
                Le formulaire de demande de devis collecte uniquement les informations
                nécessaires au traitement de votre demande&nbsp;: nom, téléphone, e-mail,
                informations sur le véhicule, description du besoin et photos éventuelles.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-extrabold uppercase tracking-wide text-ivory">Utilisation</h2>
              <p>
                Ces informations sont transmises directement à {business.name} par
                e-mail afin d&apos;établir votre devis et de vous recontacter. Elles ne
                sont ni revendues, ni transmises à des tiers, ni utilisées à des fins
                publicitaires.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-extrabold uppercase tracking-wide text-ivory">Cookies</h2>
              <p>
                Ce site n&apos;utilise pas de cookies de suivi publicitaire.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-extrabold uppercase tracking-wide text-ivory">Vos droits</h2>
              <p>
                Conformément au RGPD, vous pouvez demander l&apos;accès, la rectification
                ou la suppression de vos données en contactant le garage au{" "}
                {business.phone.display} ou directement à l&apos;atelier&nbsp;:
                {" "}{business.address.full}.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
