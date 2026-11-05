import assert from "node:assert/strict";
import { routes, href, resolveRoute } from "../ui/src/model.ts";
import { readFile, readdir, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve("preview/out");
const site = JSON.parse(await readFile("config/site.json", "utf8"));
const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'");
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [
      key,
      decode(value),
    ]),
  );
async function walk(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}
const files = await walk(root);
const pages = files.filter(
  (file) =>
    file.endsWith("/index.html") &&
    !file.includes("/_not-found/") &&
    !file.endsWith("/404/index.html"),
);
const pagePath = (file) =>
  "/" + path.relative(root, file).replace(/index\.html$/, "");
const fileFor = (pathname) =>
  path.join(
    root,
    decodeURIComponent(pathname),
    pathname.endsWith("/") ? "index.html" : "",
  );
const docs = new Map();
const failures = [];
const check = (test, message) => {
  if (!test) failures.push(message);
};
const metrics = [];
const sourceAssets = (await walk(path.resolve("ui/assets")))
  .filter(file => !/\.(png|jpe?g|gif)$/i.test(file))
  .map((file) => path.relative(path.resolve("ui/assets"), file))
  .sort();
const outputAssets = (await walk(path.join(root, "assets")))
  .map((file) => path.relative(path.join(root, "assets"), file))
  .sort();
check(
  JSON.stringify(sourceAssets) === JSON.stringify(outputAssets),
  "Exported asset inventory differs from UI source",
);
check(!outputAssets.some(file => /\.(png|jpe?g|gif)$/i.test(file)), "Raster images must be WebP in the export");
for (const file of pages) {
  const url = pagePath(file),
    html = await readFile(file, "utf8");
  const tags = [
    ...html.matchAll(/<(html|a|img|link|script|meta|[^\s/>]+)\b[^>]*>/g),
  ].map((match) => ({ ...attrs(match[0]), tagName: match[1] }));
  const links = tags.filter((tag) => tag.tagName === "link");
  const alternates = Object.fromEntries(
    links
      .filter((tag) => tag.rel === "alternate" && tag.hrefLang)
      .map((tag) => [tag.hrefLang, tag.href]),
  );
  const canonical = links.find((tag) => tag.rel === "canonical")?.href;
  const locale = site.locales.includes(url.split("/")[1])
    ? url.split("/")[1]
    : "en";
  const htmlTag = tags.find((tag) => tag.tagName === "html");
  check(htmlTag?.lang === locale, `${url}: html.lang`);
  check(htmlTag?.dir === (locale === "ar" ? "rtl" : "ltr"), `${url}: html.dir`);
  check((html.match(/<h1\b/g) || []).length === 1, `${url}: single H1`);
  check(canonical === site.origin + url, `${url}: canonical`);
  check(
    site.indexable || (site.locales.every((l) => alternates[l]) && alternates["x-default"]),
    `${url}: complete hreflang`,
  );
  const robots = tags.find(
    (tag) =>
      tag.tagName === "meta" &&
      tag.name === "robots" &&
      tag.content?.includes("noindex"),
  );
  if (!site.indexable) check(Boolean(robots), `${url}: preview noindex`);
  const localAssets = new Set();
  const legacyAssets = new Set();
  const imageAssets = new Set();
  const criticalImages = new Set();
  for (const tag of tags) {
    const value =
      tag.tagName === "a"
        ? tag.href
        : (tag.src ??
          (tag.tagName === "link" && tag.rel === "stylesheet"
            ? tag.href
            : undefined));
    if (
      !value ||
      value.startsWith("data:") ||
      value.startsWith("mailto:") ||
      value.startsWith("tel:")
    )
      continue;
    const dest = new URL(value, site.origin + url);
    if (dest.origin !== site.origin) continue;
    const destFile = fileFor(dest.pathname);
    try {
      await stat(destFile);
    } catch {
      failures.push(`${url}: missing local target ${dest.pathname}`);
      continue;
    }
    if (tag.tagName === "img") {
      check(Boolean(tag.alt !== undefined), `${url}: image alt ${value}`);
      imageAssets.add(destFile);
      if (tag.srcSet) {
        check(Boolean(tag.sizes), `${url}: responsive image missing sizes`);
        for (const candidate of tag.srcSet.split(", ")) {
          const [candidateUrl, descriptor] = candidate.split(" ");
          check(/^\d+w$/.test(descriptor), `${url}: invalid responsive width`);
          try { await stat(fileFor(candidateUrl)); }
          catch { failures.push(`${url}: missing responsive asset ${candidateUrl}`); }
        }
      }
      if (tag.loading !== "lazy") criticalImages.add(destFile);
    }
    if (tag.tagName === "a" && dest.hash) {
      const target =
        dest.pathname === url ? html : await readFile(destFile, "utf8");
      check(
        target.includes(`id="${decodeURIComponent(dest.hash.slice(1))}"`),
        `${url}: missing anchor ${dest.hash}`,
      );
    }
    if (tag.src?.endsWith(".js") && tag.noModule !== undefined)
      legacyAssets.add(destFile);
    else if (tag.src?.endsWith(".js") || tag.rel === "stylesheet")
      localAssets.add(destFile);
  }
  let jsGzip = 0,
    cssGzip = 0;
  for (const asset of localAssets) {
    const bytes = gzipSync(await readFile(asset)).length;
    if (asset.endsWith(".js")) jsGzip += bytes;
    else cssGzip += bytes;
  }
  const imageBytes = (
    await Promise.all(
      [...imageAssets].map(async (file) => (await stat(file)).size),
    )
  ).reduce((a, b) => a + b, 0);
  const criticalImageBytes = (
    await Promise.all(
      [...criticalImages].map(async (file) => (await stat(file)).size),
    )
  ).reduce((a, b) => a + b, 0);
  // Include all three self-hosted weights for the page's active language family.
  // WOFF2 is already compressed; counting every weight is a conservative inventory.
  const fontFamily = locale === "ar" ? "IBMPlexSansArabic" : "IBMPlexSans-Latin";
  const fontAssets = outputAssets.filter(
    (asset) =>
      asset.startsWith(`fonts/${fontFamily}-`) && asset.endsWith(".woff2"),
  );
  check(fontAssets.length === 3, `${url}: complete active font family`);
  check(
    links.some(
      (tag) =>
        tag.rel === "preload" &&
        tag.as === "font" &&
        tag.href === `/assets/fonts/${fontFamily}-Regular.woff2`,
    ),
    `${url}: localized font preload`,
  );
  const fontBytes = (
    await Promise.all(
      fontAssets.map(
        async (asset) => (await stat(path.join(root, "assets", asset))).size,
      ),
    )
  ).reduce((a, b) => a + b, 0);
  const baseBytes = gzipSync(html).length + jsGzip + cssGzip + fontBytes;
  const legacyJsGzip = (
    await Promise.all(
      [...legacyAssets].map(
        async (file) => gzipSync(await readFile(file)).length,
      ),
    )
  ).reduce((a, b) => a + b, 0);
  check(
    baseBytes + imageBytes <= 2048 * 1024,
    `${url}: artifact page weight exceeds 2048 KiB`,
  );
  check(
    baseBytes + criticalImageBytes <= 1024 * 1024,
    `${url}: critical artifact weight exceeds 1024 KiB`,
  );
  const schema = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  check(Boolean(schema), `${url}: missing JSON-LD`);
  if (schema) {
    try {
      const value = JSON.parse(schema[1]);
      check(
        value["@context"] === "https://schema.org",
        `${url}: invalid schema context`,
      );
    } catch {
      failures.push(`${url}: invalid JSON-LD`);
    }
  }
  check(jsGzip <= 200 * 1024, `${url}: modern browser JS exceeds 200 KiB gzip`);
  metrics.push({
    path: url,
    htmlGzip: gzipSync(html).length,
    jsGzip,
    cssGzip,
    legacyJsGzip,
    fontBytes,
    totalArtifactBytes: baseBytes + imageBytes,
    criticalArtifactBytes: baseBytes + criticalImageBytes,
  });
  docs.set(site.origin + url, { url, alternates });
}
for (const [canonical, doc] of docs)
  for (const [lang, alternate] of Object.entries(doc.alternates)) {
    check(docs.has(alternate), `${doc.url}: missing ${lang} alternate`);
    if (docs.has(alternate))
      check(
        Object.values(docs.get(alternate).alternates).includes(canonical),
        `${doc.url}: nonreciprocal ${lang}`,
      );
  }
check(
  pages.length === routes.flatMap(route => site.locales.filter(locale => resolveRoute(href(locale, route.path).split("/").filter(Boolean)))).length,
  `Expected catalog-derived localized pages; got ${pages.length}`,
);
if (!site.indexable) {
  check(
    (await readFile(path.join(root, "robots.txt"), "utf8")).includes(
      "Disallow: /",
    ),
    "preview robots",
  );
  check(
    !(await readFile(path.join(root, "sitemap.xml"), "utf8")).includes("<loc>"),
    "preview empty sitemap",
  );
}
const report = {
  timestamp: new Date().toISOString(),
  environment: "local static export",
  pages: pages.length,
  locales: site.locales,
  checks: [
    "H1",
    "lang/dir",
    "canonical",
    "reciprocal hreflang",
    "internal links/anchors/assets",
    "preview index protection",
  ],
  maxHtmlGzip: Math.max(...metrics.map((m) => m.htmlGzip)),
  jsMeasurement:
    "Modern browser script tags; nomodule polyfill reported separately. Resource inventory, not a measured Lighthouse/network score.",
  maxLegacyPolyfillGzip: Math.max(...metrics.map((m) => m.legacyJsGzip)),
  maxTotalArtifactBytes: Math.max(...metrics.map((m) => m.totalArtifactBytes)),
  maxCriticalArtifactBytes: Math.max(
    ...metrics.map((m) => m.criticalArtifactBytes),
  ),
  maxJsGzip: Math.max(...metrics.map((m) => m.jsGzip)),
  maxCssGzip: Math.max(...metrics.map((m) => m.cssGzip)),
  fontMeasurement:
    "All three WOFF2 weights of the active locale family included in both total and critical artifact bytes. This is a conservative resource inventory, not a measured network score.",
  maxFontBytes: Math.max(...metrics.map((m) => m.fontBytes)),
  failures: [...new Set(failures)],
};
await mkdir("evidence", { recursive: true });
await writeFile(
  "evidence/static-export.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
assert.equal(report.failures.length, 0, "Static export verification failed");
