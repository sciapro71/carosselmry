/**
 * ============================================================
 * CONFIGURATION CENTRALE — CARROSSERIE LOMRYE
 * ============================================================
 * Toutes les informations affichées sur le site sont ici.
 * Modifiez ce fichier pour mettre à jour textes, coordonnées,
 * horaires, services et liens — sans toucher au reste du code.
 */

export const business = {
  name: "Carrosserie Lomrye",
  legalName: "TODO — raison sociale exacte à confirmer",
  slogan: "Un choc, une bosse ? On s'occupe de vous !",
  tagline:
    "Carrosserie, peinture et mécanique à Champforgeuil. Prise en charge toutes assurances, véhicule de courtoisie offert.",
  address: {
    street: "28 Route de Demigny",
    postalCode: "71530",
    city: "Champforgeuil",
    full: "28 Route de Demigny, 71530 Champforgeuil",
  },
  phone: {
    display: "06 29 12 43 35",
    href: "tel:+33629124335",
    e164: "+33629124335",
  },
  /** TODO — confirmer l'adresse e-mail de réception des demandes de devis. */
  email: "TODO@exemple.fr",
  hours: {
    /** Jours d'ouverture non confirmés : on affiche uniquement les créneaux. */
    slots: ["8h30 – 12h00", "14h00 – 18h00"],
    note: "Horaires d'ouverture",
  },
  towing: {
    label: "Dépannage 24h/24",
    description: "Un accident, une panne ? Nous intervenons jour et nuit.",
  },
  /** URL Google Maps basée uniquement sur l'adresse (pas de coordonnées GPS inventées). */
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Carrosserie Lomrye, 28 Route de Demigny, 71530 Champforgeuil"),
  /**
   * TODO — renseigner les URLs exactes des réseaux sociaux.
   * Les visuels de l'entreprise mentionnent Facebook, Instagram et
   * Snapchat (carosserie_71) : liens à confirmer avant mise en ligne.
   * Tant qu'une URL est vide, le lien n'est pas affiché sur le site.
   */
  social: {
    facebook: "",
    instagram: "",
    snapchat: "",
  },
  /** TODO — informations légales à confirmer avant mise en ligne. */
  legal: {
    siret: "TODO — SIRET à renseigner",
    host: "TODO — hébergeur à renseigner (ex. Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA, USA)",
    director: "TODO — directeur de la publication à renseigner",
  },
  /** URL canonique du site en production (configurable via variable d'env). */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://carrosserie-lomrye.example.com",
} as const;

/* ------------------------------------------------------------ */
/* Services                                                      */
/* ------------------------------------------------------------ */

export type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  icon: "hammer" | "spray" | "shield-glass" | "wrench" | "tire" | "truck";
  highlight?: string;
};

export const services: Service[] = [
  {
    id: "carrosserie",
    title: "Carrosserie & débosselage",
    short: "Redressage, remplacement d'éléments, débosselage avec ou sans peinture.",
    description:
      "Choc, rayure profonde, élément déformé : nous remettons votre carrosserie en état dans les règles de l'art, du débosselage ponctuel à la réparation complète après accident.",
    icon: "hammer",
    highlight: "Toutes assurances",
  },
  {
    id: "peinture",
    title: "Peinture automobile",
    short: "Mise en teinte précise, application en cabine, vernis et finitions.",
    description:
      "Recherche de teinte constructeur, préparation minutieuse des surfaces, application en cabine et vernis de finition : un rendu uniforme et brillant, fidèle à l'origine.",
    icon: "spray",
  },
  {
    id: "pare-brise",
    title: "Bris de glace & pare-brise",
    short: "Remplacement et réparation de vitrage, franchise offerte.",
    description:
      "Impact ou pare-brise fissuré ? Nous remplaçons ou réparons votre vitrage rapidement. Franchise offerte et 0 € d'avance de frais selon votre contrat d'assurance.",
    icon: "shield-glass",
    highlight: "Franchise offerte",
  },
  {
    id: "mecanique",
    title: "Mécanique & entretien",
    short: "Révision, freinage, distribution, embrayage, vidange, amortisseurs.",
    description:
      "Le garage s'agrandit : entretien courant et interventions mécaniques toutes marques — freinage, distribution, embrayage, vidange, amortisseurs, boîte auto.",
    icon: "wrench",
    highlight: "Toutes marques",
  },
  {
    id: "pneus",
    title: "Pneus, parallélisme & géométrie",
    short: "Changement de pneus sans rendez-vous, réglage du train roulant.",
    description:
      "Montage et équilibrage de vos pneus sans rendez-vous, contrôle du parallélisme et réglage de la géométrie pour une tenue de route sûre et une usure régulière.",
    icon: "tire",
    highlight: "Sans rendez-vous",
  },
  {
    id: "depannage",
    title: "Dépannage 24h/24",
    short: "Intervention jour et nuit, 7 jours sur 7.",
    description:
      "Accident ou immobilisation ? Appelez-nous à toute heure : nous organisons le dépannage de votre véhicule et sa prise en charge à l'atelier.",
    icon: "truck",
    highlight: "24h/24",
  },
];

/* ------------------------------------------------------------ */
/* Avantages / bandeau de confiance                              */
/* ------------------------------------------------------------ */

export type Advantage = {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "car" | "gift" | "euro" | "clock";
};

export const advantages: Advantage[] = [
  {
    id: "assurances",
    title: "Toutes assurances",
    description: "Nous travaillons avec toutes les compagnies et gérons votre dossier.",
    icon: "shield",
  },
  {
    id: "courtoisie",
    title: "Véhicule de courtoisie offert",
    description: "Restez mobile pendant toute la durée de la réparation.",
    icon: "car",
  },
  {
    id: "franchise",
    title: "Franchise offerte",
    description: "Selon votre contrat, votre franchise est prise en charge.",
    icon: "gift",
  },
  {
    id: "avance",
    title: "0 € d'avance de frais",
    description: "Nous traitons directement avec votre assurance.",
    icon: "euro",
  },
  {
    id: "depannage",
    title: "Dépannage 24h/24",
    description: "Une urgence ? Nous intervenons jour et nuit.",
    icon: "clock",
  },
];

/* ------------------------------------------------------------ */
/* Notre méthode                                                 */
/* ------------------------------------------------------------ */

export type MethodStep = {
  step: number;
  title: string;
  description: string;
};

export const methodSteps: MethodStep[] = [
  {
    step: 1,
    title: "Diagnostic",
    description:
      "Examen complet du véhicule, chiffrage précis et échanges avec votre assurance.",
  },
  {
    step: 2,
    title: "Démontage & réparation",
    description:
      "Dépose des éléments touchés, redressage ou remplacement selon l'étendue des dégâts.",
  },
  {
    step: 3,
    title: "Préparation",
    description:
      "Ponçage, masticage, apprêt : la qualité de la peinture se joue dans la préparation.",
  },
  {
    step: 4,
    title: "Mise en peinture",
    description:
      "Teinte constructeur reproduite avec précision et appliquée en cabine.",
  },
  {
    step: 5,
    title: "Vernis & finitions",
    description:
      "Vernis de protection, lustrage et ajustement des éléments pour un rendu impeccable.",
  },
  {
    step: 6,
    title: "Contrôle & restitution",
    description:
      "Vérification finale, nettoyage du véhicule et restitution des clés.",
  },
];

/* ------------------------------------------------------------ */
/* Photos                                                        */
/* ------------------------------------------------------------ */
/**
 * TODO — aucune photo du garage n'est présente dans le dépôt.
 * Pour activer la galerie et le comparateur avant/après :
 *   1. Déposer les fichiers dans public/photos/ (JPEG ou WebP, ~1600 px de large).
 *   2. Renseigner les tableaux ci-dessous (src commençant par "/photos/").
 * Tant qu'un tableau est vide, le site affiche des emplacements réservés
 * clairement identifiés — jamais de fausses photos.
 */

export type GalleryImage = { src: string; alt: string };

export const galleryImages: GalleryImage[] = [
  // Exemple : { src: "/photos/atelier-01.jpg", alt: "Vue de l'atelier de carrosserie" },
];

export type BeforeAfterPair = {
  id: string;
  label: string;
  /** Chemins des photos ("/photos/..."), ou null tant qu'elles ne sont pas fournies. */
  before: string | null;
  after: string | null;
};

export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "exemple-1",
    label: "TODO — remplacer par une vraie réparation (photos avant / après)",
    before: null,
    after: null,
  },
];

/* ------------------------------------------------------------ */
/* Navigation                                                    */
/* ------------------------------------------------------------ */

export const navLinks = [
  { href: "#accueil", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "#savoir-faire", label: "Notre savoir-faire" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#assurances", label: "Assurances" },
  { href: "#contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------ */
/* Couleurs de la marque                                         */
/* ------------------------------------------------------------ */
/**
 * Aucune source vectorielle du logo n'est présente dans le dépôt :
 * les valeurs ci-dessous sont les teintes de référence à ajuster
 * si une charte exacte est fournie. Elles sont dupliquées dans
 * src/app/globals.css (variables CSS) — modifier les deux ensemble.
 */
export const brandColors = {
  orange: "#F36B21",
  black: "#090909",
  white: "#F7F6F2",
  steel: "#9A9A9A",
} as const;

/* ------------------------------------------------------------ */
/* Teintes proposées dans le configurateur 3D                    */
/* ------------------------------------------------------------ */

export const paintColors = [
  { id: "noir", label: "Noir profond", hex: "#0b0b0d" },
  { id: "blanc", label: "Blanc nacré", hex: "#e8e6e0" },
  { id: "argent", label: "Argent métal", hex: "#9aa0a6" },
  { id: "orange", label: "Orange Lomrye", hex: "#F36B21" },
] as const;

export type PaintColor = (typeof paintColors)[number];

/* ------------------------------------------------------------ */
/* Points interactifs sur la voiture 3D                          */
/* ------------------------------------------------------------ */

export type Hotspot = {
  id: string;
  /** Position [x, y, z] dans l'espace normalisé du modèle. */
  position: [number, number, number];
  title: string;
  text: string;
  cta: { label: string; href: string };
};

export const hotspots: Hotspot[] = [
  {
    id: "carrosserie",
    position: [0.15, 0.02, 0.5],
    title: "Carrosserie",
    text: "Débosselage, redressage et remplacement d'éléments après un choc.",
    cta: { label: "Demander un devis", href: "#devis" },
  },
  {
    id: "peinture",
    position: [0.05, 0.33, 0],
    title: "Peinture",
    text: "Teinte constructeur, application en cabine et vernis brillant.",
    cta: { label: "Demander un devis", href: "#devis" },
  },
  {
    id: "pare-brise",
    position: [-0.35, 0.26, 0.05],
    title: "Pare-brise",
    text: "Bris de glace : franchise offerte, 0 € d'avance de frais.",
    cta: { label: "Être rappelé", href: "#devis" },
  },
  {
    id: "pneus",
    position: [-0.6, -0.18, 0.48],
    title: "Pneus",
    text: "Changement sans rendez-vous, parallélisme et géométrie.",
    cta: { label: "Nous appeler", href: "tel:+33629124335" },
  },
  {
    id: "mecanique",
    position: [-0.82, 0.12, 0],
    title: "Mécanique",
    text: "Entretien, freinage, distribution, embrayage, vidange.",
    cta: { label: "Demander un devis", href: "#devis" },
  },
];
