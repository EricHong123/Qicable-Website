import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

// Deterministic delivery variants of existing, model-matched assets. No crop or enlargement.
const products = JSON.parse(await readFile("content/products.json", "utf8"));
const sources = new Set(products.flatMap(product => product.images.slice(0, 1)));
for (const name of await readdir("ui/assets/manufacturing"))
  if (/\.webp$/i.test(name)) sources.add(`/assets/manufacturing/${name}`);
await mkdir("ui/assets/responsive", { recursive: true });
const manifest = {};
const evidence = [];
for (const src of [...sources].sort()) {
  const file = "ui" + src;
  const input = await readFile(file);
  const { width, height } = await sharp(input).metadata();
  if (!width || !height) throw new Error(`Missing image dimensions: ${src}`);
  const hash = createHash("sha256").update(input).update("webp-q85-v1").digest("hex").slice(0, 16);
  const candidates = [];
  const widths = [...new Set([320, 640, 960, width].filter(value => value <= width))].sort((a, b) => a - b);
  for (const size of widths) {
    if (size === width && src.endsWith(".webp")) continue;
    const destination = `/assets/responsive/${path.parse(src).name}-${hash}-${size}.webp`;
    const output = "ui" + destination;
    try { await stat(output); } catch {
      const buffer = await sharp(input).resize({ width: size, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
      await writeFile(output, buffer);
    }
    const bytes = (await stat(output)).size;
    if (bytes < input.length) candidates.push({ src: destination, width: size, bytes });
  }
  if (!candidates.some(candidate => candidate.width === width)) candidates.push({src, width, bytes:input.length});
  manifest[src] = { width, height, srcSet: candidates.map(candidate => `${candidate.src} ${candidate.width}w`).join(", ") };
  evidence.push({src,sourceBytes:input.length,width,height,candidates});
}
await writeFile("content/responsive-images.json",JSON.stringify(manifest,null,2)+"\n");
await mkdir("evidence/seo-completion-2026-10-14",{recursive:true});
await writeFile("evidence/seo-completion-2026-10-14/image-variants.json",JSON.stringify(evidence,null,2)+"\n");
console.log(`Prepared responsive delivery for ${sources.size} original images.`);
