import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import { business } from "@/config/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default:
      "Carrosserie Lomrye — Carrosserie, peinture & mécanique à Champforgeuil (71)",
    template: "%s — Carrosserie Lomrye",
  },
  description:
    "Un choc, une bosse ? On s'occupe de vous ! Carrosserie, peinture, débosselage, pare-brise, mécanique et pneus à Champforgeuil. Toutes assurances, véhicule de courtoisie offert, franchise offerte, 0 € d'avance de frais. Dépannage 24h/24.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: business.name,
    title: "Carrosserie Lomrye — Un choc, une bosse ? On s'occupe de vous !",
    description:
      "Carrosserie, peinture, pare-brise, mécanique et pneus à Champforgeuil (71). Toutes assurances, véhicule de courtoisie offert, dépannage 24h/24.",
  },
  robots: { index: true, follow: true },
};

/** Données structurées LocalBusiness / AutoRepair (uniquement des faits vérifiés). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "AutoBodyShop"],
  name: business.name,
  slogan: business.slogan,
  telephone: business.phone.e164,
  url: business.siteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    postalCode: business.address.postalCode,
    addressLocality: business.address.city,
    addressCountry: "FR",
  },
  areaServed: "Champforgeuil, Chalon-sur-Saône et alentours",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${archivoBlack.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
