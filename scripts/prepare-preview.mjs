import "./prepare-quote-catalog.mjs";
import "./prepare-responsive-images.mjs";
import "./prepare-native-media.mjs";
import { cp, mkdir, readdir, readFile, writeFile, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { execFileSync } from "node:child_process";
await mkdir("preview/public", { recursive: true });
await rm("preview/public/assets", { recursive: true, force: true });
await cp("ui/assets", "preview/public/assets", { recursive: true, filter: source => !/\.(png|jpe?g|gif)$/i.test(source) });
async function walk(dir) {
  const list = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) list.push(...(await walk(p)));
    else list.push(p);
  }
  return list.sort();
}
const hash = createHash("sha256");
for (const f of await walk("ui/assets")) {
  hash.update(f.replaceAll("\\", "/"));
  hash.update(await readFile(f));
}
await writeFile(
  "ui/ui.manifest.json",
  JSON.stringify(
    {
      schema_version: 1,
      package_id: "qicable-industrial",
      package_version: "0.1.0",
      contract_version: 1,
      stack_profile: "trademax-next-static-v2",
      design_api_contract_version: 1,
      entrypoint: "src/index.ts",
      slots: [
        "site-shell",
        "home",
        "product-catalog",
        "product-detail",
        "article",
        "contact",
      ],
      routes: [
        "home",
        "products",
        "product",
        "article",
        "localized_article",
        "contact",
      ],
      assets_sha256: "sha256:" + hash.digest("hex"),
    },
    null,
    2,
  ) + "\n",
);

// Generate with the same typed publication policy used by sitemap and metadata.
execFileSync(process.execPath, ["--import", "tsx", "scripts/generate-llms.ts"], { stdio: "inherit" });
