"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, X, ChevronDown } from "lucide-react";
import CarScene from "@/components/three/CarScene";
import { carScroll, phaseFor, paintStep } from "@/components/three/state";
import { business, paintColors, type Hotspot } from "@/config/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------ */
/* Contenu héro (réutilisé par le fallback sans WebGL)           */
/* ------------------------------------------------------------ */

function HeroContent() {
  return (
    <div className="pointer-events-auto mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
      <p className="kicker hero-kicker mb-5 justify-center text-center text-[10px] sm:text-xs">
        Carrosserie · Peinture · Mécanique — Champforgeuil (71)
      </p>
      <h1 className="section-title text-[13vw] leading-[0.9] text-ivory sm:text-6xl lg:text-7xl">
        Carrosserie
        <span className="block text-orange">Lomrye</span>
      </h1>
      <p className="mt-5 max-w-2xl text-xl font-extrabold uppercase tracking-wide text-ivory sm:text-2xl">
        {business.slogan}
      </p>
      <p className="mt-3 max-w-xl text-base text-ivory/75 sm:text-lg">
        Votre véhicule remis en état dans les règles de l&apos;art&nbsp;: prise en charge
        toutes assurances, véhicule de courtoisie offert, 0&nbsp;€ d&apos;avance de frais.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="#devis" className="btn-primary">
          Demander un devis
        </Link>
        <a href={business.phone.href} className="btn-ghost">
          <Phone size={18} aria-hidden />
          Appeler maintenant
        </a>
      </div>
      <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-orange">
        <span aria-hidden className="inline-block h-2 w-2 animate-pulse rounded-full bg-orange" />
        {business.towing.label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Expérience complète                                           */
/* ------------------------------------------------------------ */

export default function CarExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  const [active, setActive] = useState<Hotspot | null>(null);
  const [colorId, setColorId] = useState<string>(paintColors[0].id);
  const { progress, active: loading } = useProgress();
  const loaded = !loading && progress >= 100;

  /* Détection WebGL + préférence de mouvement réduit */
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      setWebglOk(!!gl);
    } catch {
      setWebglOk(false);
    }
    carScroll.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /* Séquence liée au scroll */
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage || !webglOk) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        carScroll.p = self.progress;
        const phase = phaseFor(self.progress);
        if (stage.dataset.phase !== phase) {
          stage.dataset.phase = phase;
          // On referme la fiche d'un point si l'on quitte les phases interactives
          if (phase === "hero" || phase === "scan") setActive(null);
        }
        const step = String(paintStep(self.progress));
        if (stage.dataset.paint !== step) stage.dataset.paint = step;
      },
    });
    return () => st.kill();
  }, [webglOk]);

  /* Pause du rendu quand la scène est hors écran */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  /* Parallaxe pointeur + rotation limitée au drag horizontal */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !webglOk) return;

    let dragging = false;
    let lastX = 0;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      carScroll.pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
      carScroll.pointerY = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        carScroll.dragRot = Math.max(-0.9, Math.min(0.9, carScroll.dragRot + dx * 0.005));
      }
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
    };
    const onUp = () => {
      dragging = false;
    };

    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [webglOk]);

  /* Teinte sélectionnée → boucle de rendu */
  const selectColor = (id: string) => {
    setColorId(id);
    const c = paintColors.find((x) => x.id === id);
    if (c) carScroll.colorHex = c.hex;
  };

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  /* --------------------------------------------------------- */
  /* Fallback statique si WebGL indisponible                    */
  /* --------------------------------------------------------- */
  if (webglOk === false) {
    return (
      <section id="accueil" aria-label="Présentation" className="bg-metal booth-light">
        <div className="flex min-h-screen items-center justify-center pt-24 pb-16">
          <HeroContent />
        </div>
      </section>
    );
  }

  return (
    <section
      id="accueil"
      ref={sectionRef}
      aria-label="Présentation immersive"
      className="relative h-[420vh] md:h-[500vh]"
    >
      <div
        ref={stageRef}
        data-phase="hero"
        data-paint="0"
        className="car-stage sticky top-0 h-[100svh] w-full overflow-hidden bg-night"
      >
        {/* Scène 3D */}
        {webglOk && (
          <div className="absolute inset-0">
            <Canvas
              dpr={[1, isMobile ? 1.5 : 2]}
              frameloop={inView ? "always" : "never"}
              camera={{ fov: 34, near: 0.1, far: 60, position: [3.4, 1.2, 3.6] }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                // Laisse le scroll vertical au navigateur sur mobile
                gl.domElement.style.touchAction = "pan-y";
              }}
            >
              <Suspense fallback={null}>
                <CarScene onSelect={setActive} quality={isMobile ? "low" : "high"} />
              </Suspense>
            </Canvas>
          </div>
        )}

        {/* Écran de chargement */}
        {webglOk && !loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-night">
            <p className="section-title text-2xl text-ivory">
              Carrosserie <span className="text-orange">Lomrye</span>
            </p>
            <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-orange transition-[width] duration-300"
                style={{ width: `${Math.round(progress)}%` }}
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-steel">
              Préparation de l&apos;atelier… {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Héro */}
        <div className="overlay-hero pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-16">
          <HeroContent />
        </div>
        <div className="overlay-hero pointer-events-none absolute bottom-[4.75rem] left-1/2 z-10 -translate-x-1/2 text-ivory/60 md:bottom-6">
          <p className="flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em]">
            Faites défiler
            <ChevronDown size={18} aria-hidden className="animate-bounce" />
          </p>
        </div>

        {/* Légendes de séquence */}
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-10 px-5 sm:bottom-16 sm:left-10 sm:right-auto sm:max-w-md">
          <div className="caption caption-scan">
            <p className="kicker mb-2">Étape 1 — Diagnostic</p>
            <p className="text-xl font-extrabold uppercase leading-tight text-ivory sm:text-2xl">
              Chaque choc est analysé avec précision
            </p>
            <p className="mt-2 text-sm text-ivory/70">
              Examen complet du véhicule et chiffrage transmis à votre assurance.
            </p>
          </div>
          <div className="caption caption-hotspots">
            <p className="kicker mb-2">Étape 2 — Expertise</p>
            <p className="text-xl font-extrabold uppercase leading-tight text-ivory sm:text-2xl">
              Une expertise pour chaque zone
            </p>
            <p className="mt-2 text-sm text-ivory/70">
              Touchez les points orange pour découvrir nos interventions.
            </p>
          </div>
          <div className="caption caption-paint">
            <p className="kicker mb-2">Étape 3 — Remise en beauté</p>
            <p className="text-xl font-extrabold uppercase leading-tight text-ivory sm:text-2xl">
              Apprêt, peinture, vernis
            </p>
            <ol className="mt-3 flex gap-2" aria-label="Étapes de peinture">
              {["Apprêt", "Peinture", "Vernis"].map((s, i) => (
                <li
                  key={s}
                  data-step={i}
                  className="paint-chip rounded-full border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-ivory/60"
                >
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Final : sélecteur de teinte + appel à l'action */}
        <div className="overlay-final pointer-events-none absolute inset-x-0 bottom-20 z-10 flex flex-col items-center gap-5 px-4 sm:bottom-12">
          <p className="text-center text-lg font-extrabold uppercase tracking-wide text-ivory sm:text-2xl">
            Un résultat impeccable, <span className="text-orange">comme au premier jour</span>
          </p>
          <fieldset className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/15 bg-night/70 px-4 py-2.5 backdrop-blur">
            <legend className="sr-only">Choisir une teinte de carrosserie</legend>
            <span aria-hidden className="text-[11px] font-bold uppercase tracking-[0.2em] text-steel">
              Teinte
            </span>
            {paintColors.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Teinte ${c.label}`}
                aria-pressed={colorId === c.id}
                onClick={() => selectColor(c.id)}
                className={`h-8 w-8 rounded-full border-2 transition-transform ${
                  colorId === c.id ? "scale-110 border-orange" : "border-white/25 hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </fieldset>
          <div className="pointer-events-auto flex flex-col items-center gap-3 sm:flex-row">
            <Link href="#devis" className="btn-primary">
              Demander un devis
            </Link>
            <a href={business.phone.href} className="btn-ghost">
              <Phone size={18} aria-hidden />
              {business.phone.display}
            </a>
          </div>
        </div>

        {/* Fiche d'un point interactif */}
        {active && (
          <div
            role="dialog"
            aria-label={active.title}
            className="absolute inset-x-4 bottom-24 z-20 mx-auto max-w-sm rounded-xl border border-white/12 bg-night/92 p-5 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-10 sm:bottom-28"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Fermer"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-steel transition-colors hover:text-ivory"
            >
              <X size={18} aria-hidden />
            </button>
            <p className="kicker mb-2">{active.title}</p>
            <p className="pr-6 text-sm leading-relaxed text-ivory/85">{active.text}</p>
            {active.cta.href.startsWith("tel:") ? (
              <a href={active.cta.href} className="btn-primary mt-4 w-full !min-h-11 !py-2.5 text-sm">
                {active.cta.label}
              </a>
            ) : (
              <Link
                href={active.cta.href}
                onClick={() => setActive(null)}
                className="btn-primary mt-4 w-full !min-h-11 !py-2.5 text-sm"
              >
                {active.cta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
