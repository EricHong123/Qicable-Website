import original from "../../content/quote-catalog.json";
export type QuoteCatalogItem = {model:string;slug:string;name:string};
let cached: QuoteCatalogItem[] | undefined;
export function getQuoteCatalog(): readonly QuoteCatalogItem[] {
  if (typeof document === "undefined") return original;
  if (cached) return cached;
  const source = document.getElementById("qicable-quote-catalog");
  if (!source) return original;
  try {
    const value: unknown = JSON.parse(source.textContent ?? "");
    if (!Array.isArray(value) || value.length > 2000 || !value.every(item => item && typeof item.model === "string" && /^QC\d{2}[A-Z]\d{2}$/.test(item.model) && item.slug === item.model.toLowerCase() && typeof item.name === "string" && item.name.length <= 16000)) return [];
    cached = value;
    return cached;
  } catch { return []; }
}
