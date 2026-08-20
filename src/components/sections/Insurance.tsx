import Link from "next/link";
import { Phone } from "lucide-react";
import { advantages, business } from "@/config/site";
import { advantageIcons } from "@/components/icons";
import Reveal from "@/components/Reveal";

/** Assurances & avantages : la section qui rassure avant la demande de devis. */
export default function Insurance() {
  return (
    <section
      id="assurances"
      aria-labelledby="assurances-title"
      className="bg-ivory py-20 text-night sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <Reveal>
            <p className="kicker mb-4">Assurances &amp; avantages</p>
            <h2 id="assurances-title" className="section-title text-4xl sm:text-5xl">
              Un sinistre&nbsp;? <span className="text-orange-deep">On simplifie tout.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-night/70">
              Quelle que soit votre compagnie d&apos;assurance, nous prenons votre
              dossier en main&nbsp;: échanges avec l&apos;expert, chiffrage, réparation.
              Vous déposez votre véhicule, on s&apos;occupe du reste.
            </p>
            <p className="mt-3 text-sm text-night/55">
              Franchise offerte et avance de frais selon les conditions de votre
              contrat d&apos;assurance — on fait le point ensemble dès le premier appel.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#devis" className="btn-primary">
                Demander un devis
              </Link>
              <a href={business.phone.href} className="btn-ghost-dark">
                <Phone size={18} aria-hidden />
                {business.phone.display}
              </a>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {advantages
              .filter((a) => a.id !== "depannage")
              .map((a, i) => {
                const Icon = advantageIcons[a.icon];
                return (
                  <Reveal key={a.id} delay={Math.min(i * 0.07, 0.28)}>
                    <div className="h-full rounded-xl border border-night/10 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(9,9,9,0.25)] transition-transform hover:-translate-y-1">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange/12 text-orange-deep">
                        <Icon size={22} aria-hidden />
                      </span>
                      <h3 className="mt-4 text-base font-extrabold uppercase tracking-wide">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-night/65">{a.description}</p>
                    </div>
                  </Reveal>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
