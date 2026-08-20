"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { galleryImages } from "@/config/site";
import Reveal from "@/components/Reveal";

/**
 * Galerie de réalisations. Grille éditoriale + visionneuse plein écran
 * (navigation clavier et tactile). Tant qu'aucune photo réelle n'est
 * listée dans src/config/site.ts, des emplacements réservés sobres
 * sont affichés — jamais d'images génériques présentées comme réelles.
 */
export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const hasPhotos = galleryImages.length > 0;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + galleryImages.length - 1) % galleryImages.length)),
    []
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % galleryImages.length)),
    []
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  return (
    <section id="realisations" aria-labelledby="realisations-title" className="bg-coal py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="kicker mb-4">Réalisations</p>
          <h2 id="realisations-title" className="section-title max-w-3xl text-4xl text-ivory sm:text-5xl">
            Le travail de l&apos;atelier, <span className="text-orange">en images</span>
          </h2>
        </Reveal>

        {hasPhotos ? (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {galleryImages.map((img, i) => (
              <Reveal key={img.src} delay={Math.min(i * 0.05, 0.25)}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/8"
                  aria-label={`Agrandir : ${img.alt}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/15 bg-graphite/60 p-4 text-center"
                >
                  <Camera size={26} aria-hidden className="text-steel" />
                  <p className="text-xs font-bold uppercase tracking-widest text-steel">
                    Emplacement réservé
                  </p>
                  <p className="max-w-[24ch] text-xs text-steel/70">
                    Photo des réalisations du garage à venir
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-ivory/60">
              Les photos des réparations et de l&apos;atelier seront publiées ici dès
              qu&apos;elles seront fournies — uniquement de vraies réalisations Lomrye.
            </p>
          </Reveal>
        )}
      </div>

      {/* Visionneuse plein écran */}
      {openIndex !== null && galleryImages[openIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={galleryImages[openIndex].alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-night/96 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Fermer la visionneuse"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-ivory hover:bg-white/20"
          >
            <X size={22} aria-hidden />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Photo précédente"
            className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-ivory hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={24} aria-hidden />
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[openIndex].src}
              alt={galleryImages[openIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Photo suivante"
            className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-ivory hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={24} aria-hidden />
          </button>
        </div>
      )}
    </section>
  );
}
