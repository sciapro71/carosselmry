import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/site";
import { serviceIcons } from "@/components/icons";
import Reveal from "@/components/Reveal";

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-metal booth-light py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="kicker mb-4">Nos prestations</p>
          <h2 id="services-title" className="section-title max-w-3xl text-4xl text-ivory sm:text-5xl lg:text-6xl">
            Un atelier complet, <span className="text-orange">toutes marques</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base text-ivory/70 sm:text-lg">
            De la rayure au choc important, de l&apos;entretien courant au pare-brise&nbsp;:
            votre véhicule est pris en charge de A à Z, au même endroit.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcons[s.icon];
            return (
              <Reveal key={s.id} delay={Math.min(i * 0.07, 0.3)}>
                <article className="card-dark group flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange/12 text-orange transition-colors group-hover:bg-orange group-hover:text-white">
                      <Icon size={24} aria-hidden />
                    </span>
                    {s.highlight && (
                      <span className="rounded-full border border-orange/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange">
                        {s.highlight}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold uppercase leading-snug tracking-wide text-ivory">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ivory/65">
                    {s.description}
                  </p>
                  {s.id === "depannage" ? (
                    <a
                      href="tel:+33629124335"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange transition-colors hover:text-orange-hover"
                    >
                      Appeler maintenant
                      <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      href="#devis"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange transition-colors hover:text-orange-hover"
                    >
                      Demander un devis
                      <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
