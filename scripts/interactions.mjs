/**
 * QA des interactions : hotspots 3D, sélecteur de teinte, formulaire multi-étapes.
 * Usage : node scripts/interactions.mjs
 */
import { chromium } from "playwright-core";
import fs from "node:fs";

fs.mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await (
  await browser.newContext({ viewport: { width: 1440, height: 900 } })
).newPage();
page.on("pageerror", (e) => console.log("pageerror:", e.message.slice(0, 200)));

await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(4000);
await page.addStyleTag({
  content:
    "*, *::before, *::after { transition-duration: 0s !important; transition-delay: 0s !important; }",
});

/* --- Hotspot : clic sur un point interactif --- */
await page.evaluate(() => window.scrollTo({ top: 1900, behavior: "instant" }));
await page.waitForTimeout(2500);
const hotspots = page.locator(".hotspot");
console.log("hotspots visibles:", await hotspots.count());
await hotspots.first().click({ force: true });
await page.waitForTimeout(1200);
const dialogVisible = await page.locator('[role="dialog"]').count();
console.log("popup hotspot ouverte:", dialogVisible > 0);
await page.screenshot({ path: "screenshots/qa-hotspot-popup.png" });
await page.keyboard.press("Escape");
await page.locator('[role="dialog"] button[aria-label="Fermer"]').click({ force: true }).catch(() => {});
await page.waitForTimeout(400);

/* --- Sélecteur de teinte en phase finale --- */
const heroH = await page.evaluate(() => {
  const s = document.getElementById("accueil");
  return s.offsetHeight - window.innerHeight;
});
await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round(heroH * 0.95));
await page.waitForTimeout(2500);
await page.locator('button[aria-label="Teinte Orange Lomrye"]').click({ force: true });
await page.waitForTimeout(3500);
await page.screenshot({ path: "screenshots/qa-couleur-orange.png" });

/* --- Formulaire : validation + parcours complet --- */
await page.evaluate(() => document.getElementById("devis")?.scrollIntoView({ behavior: "instant" }));
await page.waitForTimeout(1000);

// Étape 1 : erreurs attendues avec champs vides
await page.getByRole("button", { name: /continuer/i }).click();
await page.waitForTimeout(400);
console.log("erreurs étape 1:", await page.locator(".field-error").count());
await page.screenshot({ path: "screenshots/qa-form-errors.png" });

await page.fill("#q-name", "Jean Test");
await page.fill("#q-phone", "06 12 34 56 78");
await page.fill("#q-email", "jean@test.fr");
await page.getByRole("button", { name: /continuer/i }).click();
await page.waitForTimeout(400);

await page.fill("#q-brand", "Peugeot");
await page.fill("#q-model", "308");
await page.fill("#q-plate", "AA-123-BB");
await page.getByRole("button", { name: /continuer/i }).click();
await page.waitForTimeout(400);

await page.locator('input[name="service"]').first().check({ force: true });
await page.fill("#q-damage", "Aile avant droite enfoncée suite à un accrochage sur un parking.");
await page.fill("#q-insurance", "MAIF");
await page.getByRole("button", { name: /continuer/i }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/qa-form-resume.png" });

// Consentement + envoi (attendu : message honnête, Resend non configuré)
await page.locator('input[type="checkbox"]').check({ force: true });
await page.getByRole("button", { name: /envoyer ma demande/i }).click();
await page.waitForTimeout(2500);
const alert = await page.locator('[role="alert"]').last().textContent().catch(() => "");
console.log("message après envoi:", (alert || "").slice(0, 140));
await page.screenshot({ path: "screenshots/qa-form-envoi.png" });

await browser.close();
console.log("QA interactions terminée");
