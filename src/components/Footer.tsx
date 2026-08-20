import Link from "next/link";
import { MapPin, Phone, Clock, Facebook, Instagram } from "lucide-react";
import Logo from "@/components/Logo";
import { business, navLinks, services } from "@/config/site";

export default function Footer() {
  const socials = [
    { href: business.social.facebook, label: "Facebook", Icon: Facebook },
    { href: business.social.instagram, label: "Instagram", Icon: Instagram },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-white/8 bg-night pb-24 pt-14 text-ivory md:pb-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Identité */}
        <div>
          <Logo variant="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel">
            {business.tagline}
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory transition-colors hover:border-orange hover:text-orange"
                >
                  <Icon size={18} aria-hidden />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav aria-label="Navigation pied de page">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-orange">
            Navigation
          </h2>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ivory/80 transition-colors hover:text-orange">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="#devis" className="text-sm font-semibold text-orange hover:text-orange-hover">
                Demander un devis
              </Link>
            </li>
          </ul>
        </nav>

        {/* Prestations */}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-orange">
            Prestations
          </h2>
          <ul className="space-y-2.5">
            {services.map((s) => (
              <li key={s.id}>
                <Link href="#services" className="text-sm text-ivory/80 transition-colors hover:text-orange">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coordonnées */}
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-orange">
            Contact
          </h2>
          <ul className="space-y-3 text-sm text-ivory/80">
            <li className="flex gap-2.5">
              <MapPin size={17} aria-hidden className="mt-0.5 shrink-0 text-orange" />
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-orange"
              >
                {business.address.full}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Phone size={17} aria-hidden className="mt-0.5 shrink-0 text-orange" />
              <a href={business.phone.href} className="font-semibold transition-colors hover:text-orange">
                {business.phone.display}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock size={17} aria-hidden className="mt-0.5 shrink-0 text-orange" />
              <span>
                {business.hours.slots.join(" · ")}
                <br />
                <span className="font-semibold text-orange">{business.towing.label}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/8 px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-steel md:flex-row">
          <p>
            © {new Date().getFullYear()} {business.name} — Tous droits réservés.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/mentions-legales" className="transition-colors hover:text-orange">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="transition-colors hover:text-orange">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
