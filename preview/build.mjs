/**
 * Construit l'aperçu autonome : preview/carrosserie-lomrye-apercu.html
 * (page unique — JS, CSS et modèle 3D intégrés, aucune ressource externe
 *  hormis Google Fonts).
 *
 * Usage : node preview/build.mjs
 */
import { build } from "esbuild";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = (p) => path.join(root, "preview", p);

/* 1. Bundle JS (React + Three + GSAP + composants du site) */
const result = await build({
  entryPoints: [out("entry.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  jsx: "automatic",
  write: false,
  absWorkingDir: root,
  alias: {
    "next/link": out("shims/link.tsx"),
    "next/image": out("shims/image.tsx"),
  },
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_SITE_URL": '""',
  },
  banner: { js: 'var process=globalThis.process||{env:{NODE_ENV:"production"}};' },
  logLevel: "warning",
});
const js = result.outputFiles[0].text;

/* 2. CSS Tailwind compilé depuis les sources du site */
execSync(
  `pnpm exec tailwindcss -i src/app/globals.css -o preview/.styles.css --minify`,
  { cwd: root, stdio: "inherit", env: { ...process.env, COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" } }
);
const css = fs.readFileSync(out(".styles.css"), "utf8");

/* 3. Modèle 3D embarqué en base64 — variante SANS Meshopt (pas de WASM),
      générée par scripts/optimize-model.mjs */
const glbPath = out("car-preview.glb");
if (!fs.existsSync(glbPath)) {
  console.error("preview/car-preview.glb manquant : lancez d'abord `node scripts/optimize-model.mjs`");
  process.exit(1);
}
const glbB64 = fs.readFileSync(glbPath).toString("base64");

/* 4. Assemblage — le squelette <html>/<head>/<body> est ajouté à la
      publication de l'artefact : on écrit uniquement le contenu. */
const html = `<title>Carrosserie Lomrye</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800&family=Archivo+Black&display=swap" />
<style>
:root {
  --font-archivo: "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-archivo-black: "Archivo Black", "Archivo", "Arial Black", system-ui, sans-serif;
}
html, body { margin: 0; padding: 0; background: #090909; }
${css}
</style>
<div id="root"></div>
<script>window.__CAR_GLB_B64__ = ${JSON.stringify(glbB64)};</script>
<script>${js.replace(/<\/script>/gi, "<\\/script>")}</script>
`;

const target = out("carrosserie-lomrye-apercu.html");
fs.writeFileSync(target, html);
fs.rmSync(out(".styles.css"), { force: true });
console.log(`OK : ${target} (${(html.length / 1e6).toFixed(1)} Mo)`);
