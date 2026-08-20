"use client";

import Link from "next/link";
import { Phone, FileText } from "lucide-react";
import { business } from "@/config/site";

/**
 * Barre d'action fixe en bas d'écran sur mobile :
 * appel direct + demande de devis, toujours accessibles.
 */
export default function MobileCtaBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-night/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-2">
        <a
          href={business.phone.href}
          className="flex min-h-14 items-center justify-center gap-2 font-bold uppercase tracking-wide text-ivory active:bg-white/5"
        >
          <Phone size={18} aria-hidden className="text-orange" />
          Appeler
        </a>
        <Link
          href="#devis"
          className="flex min-h-14 items-center justify-center gap-2 bg-orange font-bold uppercase tracking-wide text-white active:bg-orange-deep"
        >
          <FileText size={18} aria-hidden />
          Devis gratuit
        </Link>
      </div>
    </div>
  );
}
