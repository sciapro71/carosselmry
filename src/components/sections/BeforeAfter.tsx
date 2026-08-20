"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, MoveHorizontal } from "lucide-react";
import { beforeAfterPairs } from "@/config/site";
import Reveal from "@/components/Reveal";

/**
 * Comparateur avant / après interactif (curseur glissable, tactile et clavier).
 * Tant qu'aucune vraie paire de photos n'est fournie dans src/config/site.ts,
 * un emplacement réservé sobre et clairement identifié est affiché.
 */
function Comparator({ before, after, label }: { before: string; after: string; label: string }) {
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div
      ref={trackRef}
      className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden rounded-xl border border-white/10"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        updateFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && updateFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image src={after} alt={`${label} — après réparation`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <Image
          src={before}
          alt={`${label} — avant réparation`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
          style={{ maxWidth: "none" }}
        />
      </div>
      <span className="absolute left-3 top-3 rounded bg-night/80 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-ivory">
        Avant
      </span>
      <span className="absolute right-3 top-3 rounded bg-orange px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
        Après
      </span>
      {/* Poignée */}
      <div aria-hidden className="absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white/90" />
        <div className="absolute top-1/2 -ml-5 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-orange text-white shadow-lg">
          <MoveHorizontal size={18} />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparer avant et après réparation"
        className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="relative grid aspect-[16/10] w-full grid-cols-2 overflow-hidden rounded-xl border border-dashed border-white/20">
      <div className="flex flex-col items-center justify-center gap-3 bg-graphite p-6 text-center">
        <ImageIcon size={28} aria-hidden className="text-steel" />
        <p className="text-xs font-bold uppercase tracking-widest text-steel">Photo « avant »</p>
        <p className="max-w-[22ch] text-xs text-steel/80">Emplacement réservé — en attente des photos du garage</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 bg-coal p-6 text-center">
        <ImageIcon size={28} aria-hidden className="text-orange" />
        <p className="text-xs font-bold uppercase tracking-widest text-orange">Photo « après »</p>
        <p className="max-w-[22ch] text-xs text-steel/80">{label}</p>
      </div>
      <div aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
    </div>
  );
}

export default function BeforeAfter() {
  const pair = beforeAfterPairs[0];
  const hasRealPhotos = !!(pair && pair.before && pair.after);

  return (
    <section aria-labelledby="avant-apres-title" className="bg-night py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[2fr_3fr] lg:gap-16 lg:px-8">
        <Reveal>
          <p className="kicker mb-4">Avant / Après</p>
          <h2 id="avant-apres-title" className="section-title text-4xl text-ivory sm:text-5xl">
            Le résultat parle <span className="text-orange">de lui-même</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ivory/70">
            Débosselage, peinture, redressage&nbsp;: faites glisser le curseur pour
            comparer l&apos;état du véhicule à son arrivée et à sa restitution.
          </p>
          {!hasRealPhotos && (
            <p className="mt-4 rounded-lg border border-orange/30 bg-orange/8 p-4 text-sm text-ivory/75">
              Les photos des réparations réalisées par l&apos;atelier seront ajoutées ici.
              Cette zone est prête à les recevoir.
            </p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          {hasRealPhotos ? (
            <Comparator before={pair.before!} after={pair.after!} label={pair.label} />
          ) : (
            <Placeholder label={pair?.label ?? "Photos à venir"} />
          )}
        </Reveal>
      </div>
    </section>
  );
}
