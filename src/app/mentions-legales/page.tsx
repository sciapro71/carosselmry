import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { business } from "@/config/site";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <>
      <main className="bg-night px-4 pb-20 pt-16 text-ivory sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange hover:text-orange-hover">
            <ArrowLeft size={16} aria-hidden />
            Retour au site
          </Link>
          <h1 className="section-title mt-8 text-4xl sm:text-5xl">Mentions légales</h1>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-ivory/75">
            <section>
              <h2 className="mb-2 text-base font-extrabold uppercase tracking-wide text-ivory">Éditeur du site</h2>
              <p>
                {business.name}
                <br />
                {business.address.full}
                <br />
                Téléphone&nbsp;: {business.phone.display}
              </p>
              <p className="mt-3 rounded-lg border border-orange/30 bg-orange/8 p-3 text-ivory/70">
                Raison sociale&nbsp;: {business.legalName}
                <br />
                SIRET&nbsp;: {business.legal.siret}
                <br />
                Directeur de la publication&nbsp;: {business.legal.director}
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-extrabold uppercase tracking-wide text-ivory">Hébergement</h2>
              <p>{business.legal.host}</p>
            </section>
            <section>
              <h2 className="mb-2 text-base font-extrabold uppercase tracking-wide text-ivory">Propriété intellectuelle</h2>
              <p>
                L&apos;ensemble des contenus de ce site (textes, visuels, identité graphique)
                est la propriété de {business.name}, sauf mention contraire. Toute
                reproduction sans autorisation préalable est interdite.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
