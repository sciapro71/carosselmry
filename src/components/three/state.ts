/**
 * État partagé entre le DOM (ScrollTrigger, pointeur, sélecteur de teinte)
 * et la boucle de rendu R3F. Objet mutable volontairement hors React :
 * il est lu à chaque frame sans re-render.
 */
export const carScroll = {
  /** Progression de la séquence scrollée, 0 → 1. */
  p: 0,
  /** Position normalisée du pointeur (-1 → 1) pour la parallaxe légère. */
  pointerX: 0,
  pointerY: 0,
  /** Rotation additionnelle (drag tactile / souris), en radians. */
  dragRot: 0,
  /** Teinte de carrosserie sélectionnée (hex). */
  colorHex: "#0b0b0d",
  /** Mouvement réduit demandé par l'utilisateur. */
  reducedMotion: false,
};

/** Progression bornée entre deux jalons. */
export function ramp(p: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

/** Lissage type smoothstep. */
export function smooth(x: number) {
  return x * x * (3 - 2 * x);
}

export type Phase = "hero" | "scan" | "hotspots" | "paint" | "final";

export function phaseFor(p: number): Phase {
  if (p < 0.14) return "hero";
  if (p < 0.38) return "scan";
  if (p < 0.56) return "hotspots";
  if (p < 0.84) return "paint";
  return "final";
}

/** Sous-étape de la phase peinture : 0 = apprêt, 1 = peinture, 2 = vernis. */
export function paintStep(p: number): number {
  const d = ramp(p, 0.56, 0.84);
  if (d < 0.34) return 0;
  if (d < 0.67) return 1;
  return 2;
}
