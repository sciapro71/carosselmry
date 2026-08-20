import { NextResponse } from "next/server";
import { business } from "@/config/site";

/**
 * Route API — envoi des demandes de devis via Resend (https://resend.com).
 *
 * Variables d'environnement nécessaires :
 *   RESEND_API_KEY   — clé API Resend
 *   QUOTE_TO_EMAIL   — adresse qui reçoit les demandes (ex. la boîte du garage)
 *   QUOTE_FROM_EMAIL — (optionnel) expéditeur vérifié chez Resend ;
 *                      par défaut "onboarding@resend.dev" (mode test Resend).
 *
 * Sans configuration, la route répond honnêtement 503 : le site n'affiche
 * jamais un faux succès et propose d'appeler directement le garage.
 */

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  plate?: string;
  service?: string;
  damage?: string;
  insurance?: string;
  urgency?: string;
  consent?: boolean;
  photos?: { filename?: string; content?: string }[];
};

const MAX_PHOTOS = 5;
const MAX_TOTAL_BYTES = 18 * 1024 * 1024; // limite raisonnable pour un e-mail

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        error: `L'envoi en ligne n'est pas encore activé. Appelez-nous directement au ${business.phone.display} — nous établirons votre devis par téléphone.`,
      },
      { status: 503 }
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const required: (keyof Payload)[] = ["name", "phone", "email", "vehicleBrand", "vehicleModel", "service", "damage"];
  for (const key of required) {
    const v = body[key];
    if (typeof v !== "string" || !v.trim()) {
      return NextResponse.json(
        { error: "Formulaire incomplet : merci de vérifier les champs obligatoires." },
        { status: 400 }
      );
    }
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Le consentement au traitement de la demande est requis." },
      { status: 400 }
    );
  }

  const photos = (Array.isArray(body.photos) ? body.photos : [])
    .filter((p) => p && typeof p.content === "string" && p.content.length > 0)
    .slice(0, MAX_PHOTOS);
  const totalBytes = photos.reduce((n, p) => n + (p.content!.length * 3) / 4, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { error: "Les photos jointes sont trop volumineuses. Réduisez leur nombre ou leur taille." },
      { status: 413 }
    );
  }

  const rows: [string, string][] = [
    ["Nom", body.name!],
    ["Téléphone", body.phone!],
    ["E-mail", body.email!],
    ["Véhicule", `${body.vehicleBrand} ${body.vehicleModel}`],
    ["Immatriculation", body.plate || "—"],
    ["Prestation", body.service!],
    ["Assurance", body.insurance || "—"],
    ["Urgence", body.urgency || "—"],
    ["Description", body.damage!],
  ];

  const html = `
    <h2 style="font-family:sans-serif">Nouvelle demande de devis — ${esc(business.name)}</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top">${esc(k)}</td><td style="padding:6px 0">${esc(v).replace(/\n/g, "<br/>")}</td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:sans-serif;color:#666">${photos.length} photo(s) jointe(s).</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.QUOTE_FROM_EMAIL || "onboarding@resend.dev",
        to: [to],
        reply_to: body.email,
        subject: `Devis — ${body.name} — ${body.vehicleBrand} ${body.vehicleModel}`,
        html,
        attachments: photos.map((p, i) => ({
          filename: p.filename?.replace(/[^\w.\-]/g, "_") || `photo-${i + 1}.jpg`,
          content: p.content,
        })),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend a refusé l'envoi:", res.status, detail);
      return NextResponse.json(
        {
          error: `L'envoi n'a pas abouti pour le moment. Appelez-nous au ${business.phone.display}, nous prendrons votre demande par téléphone.`,
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur d'envoi Resend:", err);
    return NextResponse.json(
      {
        error: `Une erreur technique est survenue. Appelez-nous au ${business.phone.display}, nous prendrons votre demande par téléphone.`,
      },
      { status: 502 }
    );
  }
}
