"use client";

import dynamic from "next/dynamic";

/**
 * Chargement différé de l'expérience 3D (uniquement côté client).
 * Le squelette évite tout saut de mise en page pendant le chargement.
 */
const CarExperience = dynamic(() => import("@/components/three/CarExperience"), {
  ssr: false,
  loading: () => (
    <section id="accueil" aria-label="Chargement de la présentation" className="bg-night">
      <div className="flex min-h-screen items-center justify-center">
        <p className="section-title animate-pulse text-2xl text-ivory">
          Carrosserie <span className="text-orange">Lomrye</span>
        </p>
      </div>
    </section>
  ),
});

export default function CarExperienceLoader() {
  return <CarExperience />;
}
