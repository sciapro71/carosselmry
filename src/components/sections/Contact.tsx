import { Clock, MapPin, Navigation, Phone, Truck } from "lucide-react";
import { business } from "@/config/site";
import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-metal booth-light py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="kicker mb-4">Contact</p>
          <h2 id="contact-title" className="section-title max-w-3xl text-4xl text-ivory sm:text-5xl">
            Passez nous voir <span className="text-orange">à l&apos;atelier</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Reveal>
            <div className="card-dark h-full p-6">
              <MapPin size={24} aria-hidden className="text-orange" />
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-steel">
                Adresse
              </h3>
              <p className="mt-2 font-semibold leading-relaxed text-ivory">
                {business.address.street}
                <br />
                {business.address.postalCode} {business.address.city}
              </p>
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-orange hover:text-orange-hover"
              >
                <Navigation size={15} aria-hidden />
                Itinéraire Google Maps
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="card-dark h-full p-6">
              <Phone size={24} aria-hidden className="text-orange" />
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-steel">
                Téléphone
              </h3>
              <a
                href={business.phone.href}
                className="mt-2 block text-xl font-extrabold text-ivory transition-colors hover:text-orange"
              >
                {business.phone.display}
              </a>
              <a href={business.phone.href} className="btn-primary mt-4 !min-h-11 !px-5 !py-2.5 text-sm">
                Appeler maintenant
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="card-dark h-full p-6">
              <Clock size={24} aria-hidden className="text-orange" />
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-steel">
                {business.hours.note}
              </h3>
              <ul className="mt-2 space-y-1 font-semibold text-ivory">
                {business.hours.slots.map((slot) => (
                  <li key={slot}>{slot}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="card-dark h-full border-orange/35 p-6">
              <Truck size={24} aria-hidden className="text-orange" />
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-orange">
                {business.towing.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/75">
                {business.towing.description}
              </p>
              <a href={business.phone.href} className="btn-ghost mt-4 !min-h-11 !px-5 !py-2.5 text-sm">
                <Phone size={15} aria-hidden />
                {business.phone.display}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
