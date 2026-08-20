/**
 * Captures d'écran de contrôle qualité (usage local uniquement).
 * Usage : node scripts/screenshots.mjs [url] — défaut http://localhost:3000
 * Sorties dans ./screenshots/
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

const url = process.argv[2] || "http://localhost:3000";
const outDir = "screenshots";
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "desktop-1440", width: 1440, height: 900, mobile: false },
];

// Points de la séquence 3D (fraction de la hauteur totale de la section héro)
const scrollStops = [0, 0.25, 0.47, 0.7, 0.95];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    deviceScaleFactor: vp.mobile ? 2 : 1,
  });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") console.log(`[${vp.name}] console error:`, m.text());
  });
  page.on("pageerror", (e) => console.log(`[${vp.name}] page error:`, e.message));

  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(4000); // chargement du GLB + première frame

  // QA uniquement : le rendu logiciel headless tourne à ~2 FPS, ce qui
  // empêche les transitions CSS de démarrer. On les rend instantanées
  // pour vérifier les états (aucun impact sur le vrai site).
  await page.addStyleTag({
    content: "*, *::before, *::after { transition-duration: 0s !important; transition-delay: 0s !important; }",
  });

  const heroHeight = await page.evaluate(() => {
    const s = document.getElementById("accueil");
    return s ? s.offsetHeight - window.innerHeight : 0;
  });

  for (let i = 0; i < scrollStops.length; i++) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      Math.round(heroHeight * scrollStops[i])
    );
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${outDir}/${vp.name}-seq${i}.png` });
  }

  // Sections après l'expérience 3D
  for (const id of ["services", "savoir-faire", "realisations", "assurances", "devis", "contact"]) {
    await page.evaluate(
      (sel) => document.getElementById(sel)?.scrollIntoView({ behavior: "instant" }),
      id
    );
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${outDir}/${vp.name}-${id}.png` });
  }

  await ctx.close();
}

await browser.close();
console.log("Captures écrites dans ./screenshots/");
