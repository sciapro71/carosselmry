# Carrosserie Lomrye — Site vitrine

Site vitrine premium de **Carrosserie Lomrye** (28 Route de Demigny, 71530 Champforgeuil) :
Next.js (App Router) + TypeScript + Tailwind CSS + React Three Fiber (expérience 3D
pilotée par le scroll) + GSAP ScrollTrigger.

## Lancer le site

```bash
npm install
npm run dev        # http://localhost:3000
```

Vérifications :

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # build de production
npm start          # servir le build
```

## Où modifier les contenus

**Tout le contenu éditable est centralisé dans `src/config/site.ts`** :
coordonnées, horaires, services, avantages, étapes de la méthode, liens,
teintes du configurateur 3D, points interactifs, photos.

### Remplacer les photos (galerie & avant/après)

1. Déposer les fichiers dans `public/photos/` (JPEG/WebP, ~1600 px de large).
2. Dans `src/config/site.ts`, remplir `galleryImages` et `beforeAfterPairs`.

Tant que ces tableaux sont vides, le site affiche des emplacements réservés
clairement identifiés (aucune fausse photo).

### Remplacer le logo

Le logotype actuel est typographique (`src/components/Logo.tsx`). Dès qu'un
fichier officiel est disponible : le déposer dans `public/` (ex. `logo.svg`)
et l'utiliser dans ce composant via `next/image`.

### Adresse e-mail de réception des devis

Configurer les variables d'environnement (voir `.env.example`) :
`RESEND_API_KEY`, `QUOTE_TO_EMAIL` (et `QUOTE_FROM_EMAIL` si un domaine est
vérifié chez Resend). Sans configuration, le formulaire affiche un message
honnête et propose d'appeler le garage.

## Modèle 3D

- Fichier original (conservé tel quel) : `Meshy_AI_A_realistic_assembled_0820150203_generate.glb`
- Copie optimisée servie par le site : `public/models/car.glb`
  (générée avec `@gltf-transform/cli` : soudure, simplification, quantisation,
  compression Meshopt — décodée côté client sans ressource externe).

Le modèle est un mesh unique sans matériaux : la matière peinture
(apprêt → peinture → vernis clearcoat) est appliquée par code dans
`src/components/three/CarScene.tsx`.

## Informations à confirmer (marquées TODO dans `src/config/site.ts`)

- Adresse e-mail du garage
- Jours d'ouverture exacts (seuls les créneaux 8h30–12h00 / 14h00–18h00 sont affichés)
- Liens Facebook / Instagram / Snapchat
- Raison sociale, SIRET, hébergeur, directeur de la publication (mentions légales)

## Déploiement sur Vercel

1. Pousser le dépôt sur GitHub.
2. Sur [vercel.com](https://vercel.com) : **Add New → Project**, importer le dépôt
   (framework détecté automatiquement : Next.js, aucun réglage à changer).
3. Dans **Settings → Environment Variables**, ajouter :
   `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL` (optionnel),
   `NEXT_PUBLIC_SITE_URL` (l'URL finale du site).
4. Déployer. Chaque `git push` déclenche ensuite un déploiement automatique.
