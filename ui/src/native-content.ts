/** Server-only, deployment-selected snapshot. Never read a path from a request. */
import { readFileSync, realpathSync, statSync } from "node:fs";
import { isAbsolute } from "node:path";
import { z } from "zod";
import type { Product } from "./model";
import { locales, type Locale } from "./i18n";

const text = z.string().max(16000);
const safeLink = z.string().refine(value => /^(https?:\/\/[^\s]+|\/[^/\\\s][^\s]*|#[A-Za-z0-9_-]+)$/.test(value));
const asset = z.string().regex(/^\/(?:assets\/(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+|media\/native\/[a-f0-9]{64}\/[a-f0-9]{64}\.png)$/)
  .refine(value => !value.split("/").some(part => part === "." || part === ".."));
const inline = z.array(z.object({ text, href: safeLink.optional() }).strict()).max(1000);
const media = z.object({ src: asset, alt: text.optional(), width: z.number().int().positive().optional(), height: z.number().int().positive().optional() }).passthrough();
const block = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("paragraph"), content: inline }).strict(),
  z.object({ kind: z.literal("list"), ordered: z.boolean().optional(), items: z.array(inline).max(500) }).strict(),
  z.object({ kind: z.literal("table"), rows: z.array(z.array(z.object({ content: inline, header: z.boolean().optional() }).strict()).max(30)).max(300) }).strict(),
  z.object({ kind: z.literal("image"), image: media, caption: text.optional() }).strict(),
]);
export const nativeSectionSchema = z.object({
  heading: text, paragraphs: z.array(text).max(500), bullets: z.array(text).max(500).optional(),
  blocks: z.array(block).max(500).optional(),
  qicableRole: z.enum(["step", "question", "mistakes", "prepare", "text"]).optional(),
}).strict();
export type NativeSection = z.infer<typeof nativeSectionSchema>;
export const nativeArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: text.min(1), locale: z.enum(locales),
  description: text.optional(), excerpt: text.optional(), cover: media.optional(),
  sections: z.array(nativeSectionSchema).min(1).max(500),
  relatedLinks: z.array(z.object({ label: text, href: safeLink }).strict()).max(200).optional(),
  qicable: z.object({ version: z.literal(1), guideIndex: z.number().int().min(0).max(9) }).strict().optional(),
  category: text.optional(), publishedAt: text.optional(), updatedAt: text.optional(), readingTime: text.optional(),
  primaryKeyword: text.optional(), secondaryKeywords: z.array(text).optional(), sourcePostId: z.union([text,z.number()]).optional(),
}).strict();
export type NativeArticle = z.infer<typeof nativeArticleSchema>;
const specification = z.object({ columns: z.array(text), groups: z.array(z.object({ title: text, rows: z.array(z.object({ label: text, values: z.array(text), note: text.optional() }).strict()) }).strict()), notes: z.array(text) }).strict();
const nativeProductSchema = z.object({
  model: z.string().regex(/^QC\d{2}[A-Z]\d{2}$/), slug: text, name: text.min(1), family: text,
  moq: text, leadTime: text, featured: z.boolean().optional(), applications: z.array(text), sellingPoints: z.array(text),
  media: z.array(media), detailSections: z.array(z.object({title:text,eyebrow:text.optional(),summary:text,bullets:z.array(text),agentContent:z.boolean().optional()}).strict()),
  agentSpecifications: specification.optional(), agentCatalog: z.boolean().optional(),
  agentFeaturedRank: z.number().int().min(0).max(9).nullable().optional(), agentSkuColors: z.array(z.object({slug:text,label:text,swatch:z.string().regex(/^#[a-fA-F0-9]{6}$/),images:z.array(media)}).strict()).optional(),
  managedGallery: z.boolean().optional(), menuImage: asset.or(z.literal("")).optional(), datasheetUrl: safeLink.or(z.literal("")).optional(),
  qicable: z.object({ version: z.literal(1), source: z.record(z.unknown()) }).strict().optional(),
}).strict();
export type NativeProduct = z.infer<typeof nativeProductSchema>;
const envelope = z.object({ version: z.literal(1), site: z.literal("https://www.qicable.com"),
  articles: z.array(nativeArticleSchema).max(3000), products: z.array(nativeProductSchema).max(2000) }).strict();

function loadSnapshot() {
  const path = process.env.QICABLE_CONTENT_SNAPSHOT;
  if (!path) return null;
  if (!isAbsolute(path) || realpathSync(path) !== path || !statSync(path).isFile() || statSync(path).size > 32 * 1024 * 1024)
    throw new Error("Invalid deployment content snapshot");
  const data = envelope.parse(JSON.parse(readFileSync(path, "utf8")));
  const identities = new Set<string>();
  for (const item of data.articles) {
    const key = `${item.locale}:${item.slug}`;
    if (identities.has(key)) throw new Error("Duplicate article identity");
    identities.add(key);
  }
  const models = new Set<string>();
  for (const item of data.products) {
    if (models.has(item.model) || item.slug !== item.model.toLowerCase()) throw new Error("Invalid product identity");
    models.add(item.model);
  }
  return data;
}
export const nativeContent = loadSnapshot();
export function nativeArticle(locale: Locale, slug: string) {
  return nativeContent?.articles.find(item => item.locale === locale && item.slug === slug);
}
export function nativeProduct(model: string) {
  return nativeContent?.products.find(item => item.model === model);
}
export function projectProduct(value: NativeProduct, fallback?: Product): unknown {
  const source = value.qicable?.source ?? fallback ?? {};
  const fields = new Map(value.agentSpecifications?.groups[0]?.rows.map(row => [row.label, row.values.join(" / ")] as const) ?? []);
  return {
    ...source, model: value.model, slug: value.slug, name: value.name, category: value.family,
    interface: fields.get("Interface") ?? source.interface ?? "",
    connectorA: fields.get("Connector A") ?? source.connectorA ?? "",
    connectorB: fields.get("Connector B") ?? source.connectorB ?? "",
    mounting: fields.get("Mounting") ?? source.mounting ?? "",
    lengths: fields.has("Lengths") ? fields.get("Lengths")!.split(" / ") : source.lengths ?? [],
    subcategory: fields.get("Subcategory") ?? source.subcategory ?? "",
    engineering: value.agentSpecifications ? value.agentSpecifications.groups.slice(1).flatMap(group => group.rows.map(row => ({label:row.label,value:row.values.join(" / ")}))) : source.engineering ?? [],
    featured: value.featured ?? false, images: value.media.map(image => image.src),
    sourceUrl: source.sourceUrl ?? null, sourceRow: source.sourceRow ?? "Native catalog",
    reviewStatus: source.reviewStatus ?? "approved", legacyModels: source.legacyModels ?? [],
    mediaStatus: source.mediaStatus ?? "provided",
  };
}
