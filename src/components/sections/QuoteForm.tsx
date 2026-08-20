"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Loader2,
  Phone,
  Send,
  X,
} from "lucide-react";
import { business, services } from "@/config/site";

/* ------------------------------------------------------------ */
/* Modèle de données du formulaire                               */
/* ------------------------------------------------------------ */

type FormData = {
  name: string;
  phone: string;
  email: string;
  vehicleBrand: string;
  vehicleModel: string;
  plate: string;
  service: string;
  damage: string;
  insurance: string;
  urgency: string;
  consent: boolean;
};

const INITIAL: FormData = {
  name: "",
  phone: "",
  email: "",
  vehicleBrand: "",
  vehicleModel: "",
  plate: "",
  service: "",
  damage: "",
  insurance: "",
  urgency: "Sous quelques jours",
  consent: false,
};

const URGENCIES = [
  "Véhicule immobilisé — urgent",
  "Dès que possible",
  "Sous quelques jours",
  "Je me renseigne simplement",
];

const MAX_PHOTOS = 5;
const MAX_PHOTO_MB = 4;

const STEPS = ["Vos coordonnées", "Votre véhicule", "Votre demande", "Photos & envoi"];

type Errors = Partial<Record<keyof FormData | "photos", string>>;

/* ------------------------------------------------------------ */

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [status, setStatus] = useState<
    | { kind: "idle" }
    | { kind: "sending" }
    | { kind: "sent" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });
  const fileInput = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  /* Validation par étape */
  const validateStep = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (data.name.trim().length < 2) e.name = "Merci d'indiquer votre nom.";
      if (!/^(\+33|0)[1-9](?:[ .-]?\d{2}){4}$/.test(data.phone.trim()))
        e.phone = "Numéro de téléphone français invalide (ex. 06 12 34 56 78).";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()))
        e.email = "Adresse e-mail invalide.";
    }
    if (s === 1) {
      if (!data.vehicleBrand.trim()) e.vehicleBrand = "Merci d'indiquer la marque.";
      if (!data.vehicleModel.trim()) e.vehicleModel = "Merci d'indiquer le modèle.";
    }
    if (s === 2) {
      if (!data.service) e.service = "Choisissez la prestation concernée.";
      if (data.damage.trim().length < 10)
        e.damage = "Décrivez brièvement le dommage (quelques mots suffisent).";
    }
    if (s === 3) {
      if (!data.consent) e.consent = "Votre accord est nécessaire pour traiter la demande.";
    }
    return e;
  };

  const goNext = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Photos */
  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const next = [...photos];
    let error: string | undefined;
    for (const file of Array.from(files)) {
      if (next.length >= MAX_PHOTOS) {
        error = `Maximum ${MAX_PHOTOS} photos.`;
        break;
      }
      if (!file.type.startsWith("image/")) {
        error = "Seules les images sont acceptées.";
        continue;
      }
      if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
        error = `Chaque photo doit faire moins de ${MAX_PHOTO_MB} Mo.`;
        continue;
      }
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotos(next);
    setErrors((e) => ({ ...e, photos: error }));
    if (fileInput.current) fileInput.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((p) => {
      URL.revokeObjectURL(p[index].url);
      return p.filter((_, i) => i !== index);
    });
  };

  /* Envoi */
  const submit = async () => {
    const e = validateStep(3);
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;
    setStatus({ kind: "sending" });
    try {
      const encoded = await Promise.all(
        photos.map(
          (p) =>
            new Promise<{ filename: string; content: string }>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  filename: p.file.name,
                  content: String(reader.result).split(",")[1] ?? "",
                });
              reader.onerror = reject;
              reader.readAsDataURL(p.file);
            })
        )
      );
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, photos: encoded }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({
          kind: "error",
          message:
            body?.error ??
            "L'envoi n'a pas abouti. Appelez-nous directement, nous vous répondrons tout de suite.",
        });
        return;
      }
      setStatus({ kind: "sent" });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Connexion impossible. Vérifiez votre réseau ou appelez-nous directement.",
      });
    }
  };

  const selectedService = useMemo(
    () => services.find((s) => s.id === data.service)?.title ?? data.service,
    [data.service]
  );

  /* Écran de confirmation */
  if (status.kind === "sent") {
    return (
      <div className="rounded-2xl border border-night/10 bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/15 text-orange-deep">
          <Check size={30} aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-extrabold uppercase tracking-wide text-night">
          Demande envoyée !
        </h3>
        <p className="mx-auto mt-3 max-w-md text-night/70">
          Merci {data.name}. Nous vous rappelons au plus vite au{" "}
          <strong>{data.phone}</strong> pour établir votre devis.
        </p>
        <p className="mt-6 text-sm text-night/55">Besoin d&apos;une réponse immédiate&nbsp;?</p>
        <a href={business.phone.href} className="btn-primary mt-3">
          <Phone size={18} aria-hidden />
          {business.phone.display}
        </a>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28 rounded-2xl border border-night/10 bg-white p-5 shadow-sm sm:p-8">
      {/* Indicateur d'étapes */}
      <ol className="mb-8 flex items-center gap-1.5" aria-label="Progression du formulaire">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-1.5">
            <span
              className={`h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-orange" : "bg-night/10"
              }`}
            />
            <span
              className={`hidden text-[11px] font-bold uppercase tracking-wider sm:block ${
                i === step ? "text-orange-deep" : "text-night/40"
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mb-6 text-sm font-bold uppercase tracking-widest text-orange-deep sm:hidden">
        Étape {step + 1}/{STEPS.length} — {STEPS[step]}
      </p>

      {/* ÉTAPE 1 — Coordonnées */}
      {step === 0 && (
        <div className="grid gap-5">
          <div>
            <label htmlFor="q-name" className="field-label">
              Nom et prénom *
            </label>
            <input
              id="q-name"
              className="field-input"
              autoComplete="name"
              value={data.name}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "q-name-err" : undefined}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && (
              <p id="q-name-err" className="field-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="q-phone" className="field-label">
                Téléphone *
              </label>
              <input
                id="q-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                className="field-input"
                value={data.phone}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "q-phone-err" : undefined}
                onChange={(e) => set("phone", e.target.value)}
              />
              {errors.phone && (
                <p id="q-phone-err" className="field-error" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="q-email" className="field-label">
                E-mail *
              </label>
              <input
                id="q-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="field-input"
                value={data.email}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "q-email-err" : undefined}
                onChange={(e) => set("email", e.target.value)}
              />
              {errors.email && (
                <p id="q-email-err" className="field-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 — Véhicule */}
      {step === 1 && (
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="q-brand" className="field-label">
                Marque *
              </label>
              <input
                id="q-brand"
                className="field-input"
                placeholder="Ex. Peugeot"
                value={data.vehicleBrand}
                aria-invalid={!!errors.vehicleBrand}
                aria-describedby={errors.vehicleBrand ? "q-brand-err" : undefined}
                onChange={(e) => set("vehicleBrand", e.target.value)}
              />
              {errors.vehicleBrand && (
                <p id="q-brand-err" className="field-error" role="alert">
                  {errors.vehicleBrand}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="q-model" className="field-label">
                Modèle *
              </label>
              <input
                id="q-model"
                className="field-input"
                placeholder="Ex. 308"
                value={data.vehicleModel}
                aria-invalid={!!errors.vehicleModel}
                aria-describedby={errors.vehicleModel ? "q-model-err" : undefined}
                onChange={(e) => set("vehicleModel", e.target.value)}
              />
              {errors.vehicleModel && (
                <p id="q-model-err" className="field-error" role="alert">
                  {errors.vehicleModel}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="q-plate" className="field-label">
              Immatriculation (facultatif)
            </label>
            <input
              id="q-plate"
              className="field-input uppercase"
              placeholder="AA-123-BB"
              value={data.plate}
              onChange={(e) => set("plate", e.target.value.toUpperCase())}
            />
          </div>
        </div>
      )}

      {/* ÉTAPE 3 — Demande */}
      {step === 2 && (
        <div className="grid gap-5">
          <fieldset>
            <legend className="field-label">Prestation recherchée *</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {services.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3.5 transition-colors ${
                    data.service === s.id
                      ? "border-orange bg-orange/8"
                      : "border-night/10 hover:border-night/25"
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={data.service === s.id}
                    onChange={() => set("service", s.id)}
                    className="h-4 w-4 accent-[var(--color-brand-orange)]"
                  />
                  <span className="text-sm font-semibold text-night">{s.title}</span>
                </label>
              ))}
            </div>
            {errors.service && (
              <p className="field-error" role="alert">
                {errors.service}
              </p>
            )}
          </fieldset>
          <div>
            <label htmlFor="q-damage" className="field-label">
              Description du dommage ou du besoin *
            </label>
            <textarea
              id="q-damage"
              rows={4}
              className="field-input resize-y"
              placeholder="Ex. Aile avant droite enfoncée suite à un accrochage sur un parking…"
              value={data.damage}
              aria-invalid={!!errors.damage}
              aria-describedby={errors.damage ? "q-damage-err" : undefined}
              onChange={(e) => set("damage", e.target.value)}
            />
            {errors.damage && (
              <p id="q-damage-err" className="field-error" role="alert">
                {errors.damage}
              </p>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="q-insurance" className="field-label">
                Votre assurance (facultatif)
              </label>
              <input
                id="q-insurance"
                className="field-input"
                placeholder="Ex. MAIF, AXA…"
                value={data.insurance}
                onChange={(e) => set("insurance", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="q-urgency" className="field-label">
                Niveau d&apos;urgence
              </label>
              <select
                id="q-urgency"
                className="field-input"
                value={data.urgency}
                onChange={(e) => set("urgency", e.target.value)}
              >
                {URGENCIES.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ÉTAPE 4 — Photos, résumé, consentement */}
      {step === 3 && (
        <div className="grid gap-6">
          <div>
            <p className="field-label">Photos du dommage (facultatif, max {MAX_PHOTOS})</p>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              id="q-photos"
              onChange={(e) => addPhotos(e.target.files)}
            />
            <div className="flex flex-wrap gap-3">
              {photos.map((p, i) => (
                <div key={p.url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-night/15">
                  <Image src={p.url} alt={`Photo ${i + 1} du dommage`} fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label={`Retirer la photo ${i + 1}`}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-night/80 text-white"
                  >
                    <X size={13} aria-hidden />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <label
                  htmlFor="q-photos"
                  className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-night/20 text-night/50 transition-colors hover:border-orange hover:text-orange-deep"
                >
                  <ImagePlus size={22} aria-hidden />
                  <span className="text-[11px] font-bold uppercase">Ajouter</span>
                </label>
              )}
            </div>
            {errors.photos && (
              <p className="field-error" role="alert">
                {errors.photos}
              </p>
            )}
          </div>

          {/* Résumé avant envoi */}
          <div className="rounded-xl bg-paper p-5">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-night">
              Résumé de votre demande
            </h3>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-bold text-night/50">Contact</dt>
                <dd className="text-night">
                  {data.name} — {data.phone}
                  <br />
                  {data.email}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-night/50">Véhicule</dt>
                <dd className="text-night">
                  {data.vehicleBrand} {data.vehicleModel}
                  {data.plate && ` — ${data.plate}`}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-night/50">Prestation</dt>
                <dd className="text-night">{selectedService || "—"}</dd>
              </div>
              <div>
                <dt className="font-bold text-night/50">Urgence</dt>
                <dd className="text-night">{data.urgency}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-bold text-night/50">Description</dt>
                <dd className="whitespace-pre-wrap text-night">{data.damage}</dd>
              </div>
              {data.insurance && (
                <div>
                  <dt className="font-bold text-night/50">Assurance</dt>
                  <dd className="text-night">{data.insurance}</dd>
                </div>
              )}
              {photos.length > 0 && (
                <div>
                  <dt className="font-bold text-night/50">Photos</dt>
                  <dd className="text-night">{photos.length} jointe(s)</dd>
                </div>
              )}
            </dl>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={data.consent}
              onChange={(e) => set("consent", e.target.checked)}
              className="mt-1 h-5 w-5 accent-[var(--color-brand-orange)]"
              aria-invalid={!!errors.consent}
            />
            <span className="text-sm leading-relaxed text-night/70">
              J&apos;accepte que mes informations soient utilisées par {business.name} pour
              traiter ma demande de devis. Elles ne seront jamais transmises à des tiers. *
            </span>
          </label>
          {errors.consent && (
            <p className="field-error !mt-0" role="alert">
              {errors.consent}
            </p>
          )}

          {status.kind === "error" && (
            <div className="rounded-lg border border-orange/50 bg-orange/10 p-4" role="alert">
              <p className="text-sm font-semibold text-night">{status.message}</p>
              <a href={business.phone.href} className="btn-primary mt-3 !min-h-11 !py-2.5 text-sm">
                <Phone size={16} aria-hidden />
                Appeler le {business.phone.display}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={goBack} className="btn-ghost-dark !min-h-12">
            <ArrowLeft size={17} aria-hidden />
            Retour
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={goNext} className="btn-primary !min-h-12">
            Continuer
            <ArrowRight size={17} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={status.kind === "sending"}
            className="btn-primary !min-h-12 disabled:opacity-60"
          >
            {status.kind === "sending" ? (
              <>
                <Loader2 size={17} aria-hidden className="animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                <Send size={17} aria-hidden />
                Envoyer ma demande
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
