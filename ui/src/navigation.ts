import { translateText } from "./locale-runtime";
import type { Locale } from "./i18n";
import type { Product } from "./model";
export const categorySlugs = [
  "machine-vision",
  "industrial-ethernet",
  "m8-m12",
  "industrial-communication",
  "industrial-display",
  "panel-mount",
] as const;
export const applicationSlugs = [
  "machine-vision",
  "factory-automation",
  "robotics",
  "industrial-pc-hmi",
  "equipment-integration",
] as const;
export const guideSlugs = [
  "machine-vision-cable-selection-guide",
  "m12-coding-guide",
  "static-vs-continuous-flex-cables",
  "panel-mount-cable-dimensions-guide",
  "rs232-vs-rs485-vs-ttl",
  "cable-shielding-grounding-guide",
  "usb3-vision-cable-length-guide",
  "gige-vision-packet-loss-troubleshooting",
  "custom-cable-assembly-rfq-checklist",
  "usb-rs485-wiring-troubleshooting",
] as const;
export function href(locale: Locale, path: string): string {
  const article = guideSlugs.some((slug) => path === `/${slug}/`);
  return locale === "en" ? path : `/${locale}${article ? "/blog" : ""}${path}`;
}
export function productName(p: Pick<Product, "model" | "name">, l: Locale) {
  if(l === "en") return p.name;
  if (!["de","es","fr","pt","ar"].includes(l)) return translateText(p.name,l);
  const words = {de:["Kabel", "auf"],es:["Cable", "a"],fr:["Câble", "vers"],pt:["Cabo", "para"],ar:["كابل", "إلى"]}[l as "de"|"es"|"fr"|"pt"|"ar"];
  return `${words[0]} ${p.name.replace(/ to /g, ` ${words[1]} `).replace(/ Cable/g, "")}`;
}
export function inquiryHref(
  locale: Locale,
  model?: string,
  type = "quotation",
) {
  const params = new URLSearchParams({ type });
  if (model) {
    params.set("model", model);
    if (/^QC\d{2}[A-Z]\d{2}$/.test(model))
      params.set("from", href(locale, `/products/${model.toLowerCase()}/`));
  }
  return href(locale, "/contact/") + "?" + params.toString();
}

export const categoryDisplayOrder = [0, 1, 2, 3, 5, 4] as const;

export const categoryGuides: readonly (readonly number[])[] = [[0,6,2],[1,7,5],[1,8],[4,9],[3,5],[3,8]];
