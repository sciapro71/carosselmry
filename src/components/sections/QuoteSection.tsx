import { Phone } from "lucide-react";
import { business } from "@/config/site";
import QuoteForm from "@/components/sections/QuoteForm";
import Reveal from "@/components/Reveal";

export default function QuoteSection() {
  return (
    <section
      id="devis"
      aria-labelledby="devis-title"
      className="scroll-mt-20 bg-paper py-20 text-night sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <Reveal>
            <p className="kicker mb-4">Devis gratuit</p>
            <h2 id="devis-title" className="section-title text-4xl sm:text-5xl">
              Recevez votre devis <span className="text-orange-deep">rapidement</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-night/70">
              Décrivez votre besoin en quelques étapes, joignez des photos du
              dommage si vous le pouvez&nbsp;: nous vous rappelons avec un chiffrage
              clair, sans engagement.
            </p>
            <div className="mt-8 rounded-xl border border-night/10 bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-widest text-night/50">
                Vous préférez appeler&nbsp;?
              </p>
              <a
                href={business.phone.href}
                className="mt-2 inline-flex items-center gap-3 text-2xl font-extrabold text-night transition-colors hover:text-orange-deep"
              >
                <Phone size={22} aria-hidden className="text-orange" />
                {business.phone.display}
              </a>
              <p className="mt-2 text-sm text-night/60">
                {business.hours.slots.join(" · ")} —{" "}
                <span className="font-semibold text-orange-deep">{business.towing.label}</span>
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <QuoteForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
