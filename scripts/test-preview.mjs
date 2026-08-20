import { chromium } from "playwright-core";
import http from "node:http";
import fs from "node:fs";

// Sert l'aperçu dans le même squelette que la page d'artefact
const content = fs.readFileSync("preview/carrosserie-lomrye-apercu.html", "utf8");
const page_ = `<!doctype html><html><head></head><body>${content}</body></html>`;
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    // Simule la CSP stricte de la page d'artefact : aucun fetch externe
    // ni data:, uniquement scripts/styles inline et Google Fonts.
    "Content-Security-Policy":
      "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src data: blob:; connect-src 'self'",
  });
  res.end(page_);
});
await new Promise((r) => server.listen(4600, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 200)); });
await page.goto("http://localhost:4600", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(9000);
const state = await page.evaluate(() => ({
  hasCanvas: !!document.querySelector("canvas"),
  phase: document.querySelector(".car-stage")?.dataset.phase,
  sections: ["services", "savoir-faire", "realisations", "assurances", "devis", "contact"].map((id) => !!document.getElementById(id)),
  bodyH: document.body.scrollHeight,
  title: document.title,
}));
console.log(JSON.stringify(state));
console.log("erreurs:", errors.length ? errors : "aucune");
await page.screenshot({ path: "screenshots/preview-hero.png" });
await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
await page.waitForTimeout(3000);
await page.screenshot({ path: "screenshots/preview-hotspots.png" });
await browser.close();
server.close();
console.log("test terminé");
