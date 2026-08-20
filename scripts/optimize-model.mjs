/**
 * Optimisation du modèle 3D pour le web.
 *
 * Entrée  : Meshy_AI_A_realistic_assembled_0820150203_generate.glb (original conservé)
 * Sortie  : public/models/car.glb (soudé, simplifié, quantisé, compressé Meshopt)
 *
 * Usage : node scripts/optimize-model.mjs
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions";
import { dedup, prune, weld, simplify, quantize, reorder } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INPUT = path.join(root, "Meshy_AI_A_realistic_assembled_0820150203_generate.glb");
const OUTPUT = path.join(root, "public", "models", "car.glb");

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
});

const doc = await io.read(INPUT);

await doc.transform(
  dedup(),
  weld(),
  // ~55 % des triangles conservés : imperceptible à l'écran, gain majeur en 4G
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.55, error: 0.0008 }),
  reorder({ encoder: MeshoptEncoder }),
  quantize(),
  prune()
);

doc.createExtension(EXTMeshoptCompression).setRequired(true);

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
await io.write(OUTPUT, doc);

const before = fs.statSync(INPUT).size;
const after = fs.statSync(OUTPUT).size;
console.log(`OK : ${(before / 1e6).toFixed(1)} Mo → ${(after / 1e6).toFixed(1)} Mo (${OUTPUT})`);
