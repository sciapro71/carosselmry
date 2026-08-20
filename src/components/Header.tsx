"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import { business, navLinks } from "@/config/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll du fond quand le menu mobile est ouvert
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-night/92 backdrop-blur-md border-b border-white/8"
          : "bg-gradient-to-b from-night/85 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link href="#accueil" aria-label="Carrosserie Lomrye — retour à l'accueil" onClick={() => setOpen(false)}>
          <Logo variant="light" compact />
        </Link>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-semibold uppercase tracking-wide text-ivory/85 transition-colors hover:text-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={business.phone.href}
            className="hidden items-center gap-2 text-sm font-bold text-ivory transition-colors hover:text-orange md:flex"
          >
            <Phone size={16} aria-hidden className="text-orange" />
            {business.phone.display}
          </a>
          <Link href="#devis" className="btn-primary hidden !min-h-11 !px-5 !py-2.5 text-sm md:inline-flex">
            Demander un devis
          </Link>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded text-ivory lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} aria-hidden /> : <Menu size={26} aria-hidden />}
          </button>
        </div>
      </div>

      {/* Menu mobile plein écran */}
      {open && (
        <nav
          id="menu-mobile"
          aria-label="Navigation mobile"
          className="lg:hidden h-[calc(100dvh-4rem)] overflow-y-auto bg-night px-6 pb-10 pt-4"
        >
          <ul className="flex flex-col divide-y divide-white/8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-xl font-bold uppercase tracking-wide text-ivory transition-colors hover:text-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="#devis" onClick={() => setOpen(false)} className="btn-primary w-full">
              Demander un devis
            </Link>
            <a href={business.phone.href} className="btn-ghost w-full">
              <Phone size={18} aria-hidden />
              {business.phone.display}
            </a>
            <p className="mt-2 text-center text-sm font-semibold uppercase tracking-widest text-orange">
              {business.towing.label}
            </p>
          </div>
        </nav>
      )}
    </header>
  );
}
