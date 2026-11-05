import "./locale-server";
import {certificateCopy} from "./certificates";
import { applicationTitles } from "./application-content";
import { categoryContent } from "./category-content";
import { isServiceKind, serviceContent, servicePaths } from "./service-content";
import { isPolicyKind, policyContent } from "./policy-content";
import {
  categorySlugs,
  applicationSlugs,
  guideSlugs,
  href as navigationHref,
  productName,
} from "./navigation";
export {
  categorySlugs,
  applicationSlugs,
  guideSlugs,
  productName,
  inquiryHref,
} from "./navigation";
import productsData from "../../content/products.json";
import { nativeContent, nativeArticle, projectProduct } from "./native-content";
import { z } from "zod";
import { locales, messages, type Locale } from "./i18n";
export const productSchema = z.object({
  model: z.string().regex(/^QC\d{2}[A-Z]\d{2}$/),
  slug: z.string(),
  category: z.enum(categorySlugs),
  name: z.string(),
  interface: z.string(),
  connectorA: z.string(),
  connectorB: z.string(),
  mounting: z.string(),
  lengths: z.array(z.string()),
  featured: z.boolean(),
  images: z.array(z.string().regex(/^\/(?:assets\/|media\/native\/)/)),
  sourceUrl: z.string().url().nullable(),
  reviewStatus: z.enum(["draft", "approved"]),
  sourceRow: z.string(),
  subcategory: z.string(),
  engineering: z.array(z.object({label:z.string(), value:z.string()})),
  legacyModels: z.array(z.string()),
  mediaStatus: z.enum(["provided", "pending-review"]),
});
export type Product = z.infer<typeof productSchema>;
export const products = productSchema.array().parse(nativeContent
  ? nativeContent.products.map(item => projectProduct(item)) : productsData);
export function href(locale: Locale, path: string): string {
  const slug = path.replace(/^\/+|\/+$/g, "");
  if (nativeContent?.articles.some(item => item.slug === slug))
    return locale === "en" ? path : `/${locale}/blog${path}`;
  return navigationHref(locale, path);
}
export type RouteKind =
  | "home"
  | "catalog"
  | "product"
  | "applications"
  | "application"
  | "custom"
  | "quality"
  | "certificates"
  | "resources"
  | "guides"
  | "guide"
  | "downloads"
  | "faq"
  | "about"
  | "contact"
  | "privacy"
  | "cookies"
  | "terms"
  | "purchasing"
  | "samples"
  | "support"
  | "partners";
export type PageRoute = {
  path: string;
  kind: RouteKind;
  index?: number;
  product?: Product;
};
export const routes: PageRoute[] = [
  { path: "/", kind: "home" },
  { path: "/products/", kind: "catalog" },
  ...categorySlugs.map((slug, index) => ({
    path: `/products/${slug}/`,
    kind: "catalog" as const,
    index,
  })),
  ...products.map((product) => ({
    path: `/products/${product.slug}/`,
    kind: "product" as const,
    product,
  })),
  { path: "/applications/", kind: "applications" },
  ...applicationSlugs.map((slug, index) => ({
    path: `/applications/${slug}/`,
    kind: "application" as const,
    index,
  })),
  { path: "/custom-cable-assemblies/", kind: "custom" },
  { path: "/quality/", kind: "quality" },
  { path: "/certificates/", kind: "certificates" },
  { path: "/resources/", kind: "resources" },
  { path: "/resources/guides/", kind: "guides" },
  { path: "/blog/", kind: "guides" },
  ...guideSlugs.map((slug, index) => ({
    path: `/${slug}/`,
    kind: "guide" as const,
    index,
  })),
  ...[...new Set(nativeContent?.articles.map(item => item.slug) ?? [])]
    .filter(slug => !guideSlugs.some(existing => existing === slug))
    .map(slug => ({ path: `/${slug}/`, kind: "guide" as const })),
  { path: "/resources/downloads/", kind: "downloads" },
  { path: "/resources/faq/", kind: "faq" },
  { path: "/about/", kind: "about" },
  { path: "/contact/", kind: "contact" },
  { path: servicePaths.samples, kind: "samples" },
  { path: servicePaths.support, kind: "support" },
  { path: servicePaths.partners, kind: "partners" },
  { path: "/privacy/", kind: "privacy" },
  { path: "/cookies/", kind: "cookies" },
  { path: "/terms/", kind: "terms" },
  { path: "/purchasing/", kind: "purchasing" },
];
export function resolveRoute(
  path?: string[],
): { locale: Locale; route: PageRoute } | null {
  const segments = [...(path ?? [])];
  let locale: Locale = "en";
  if (locales.includes(segments[0] as Locale) && segments[0] !== "en")
    locale = segments.shift() as Locale;
  if (locale !== "en" && segments[0] === "blog" && segments.length > 1) segments.shift();
  const logical = "/" + segments.join("/") + (segments.length ? "/" : "");
  const route = routes.find((r) => r.path === logical);
  if (!route) return null;
  if (nativeContent && route.kind === "guide" && !nativeArticle(locale, logical.slice(1, -1))) return null;
  const actual =
    "/" + (path ?? []).join("/") + ((path ?? []).length ? "/" : "");
  return href(locale, route.path) === actual ? { locale, route } : null;
}
export function pageTitle(route: PageRoute, locale: Locale): string {
  if (isServiceKind(route.kind)) return serviceContent[locale][route.kind].title;
  if (isPolicyKind(route.kind)) return policyContent[locale].pages[route.kind].title;
  const t = messages[locale];
  switch (route.kind) {
    case "home":
      return t.heroTitle;
    case "catalog":
      return route.index === undefined
        ? t.catalogTitle
        : categoryContent[locale].families[route.index].title;
    case "product":
      return `${route.product!.model} · ${productName(route.product!, locale)}`;
    case "applications":
      return t.applicationsTitle;
    case "application":
      return applicationTitles[locale][route.index!];
    case "custom":
      return t.customTitle;
    case "certificates":
      return certificateCopy[locale].title;
    case "quality":
      return t.quality;
    case "guide":
      return nativeArticle(locale, route.path.slice(1, -1))?.title ?? t.guideNames[route.index!];
    case "guides":
      return t.guides;
    case "resources":
      return t.resources;
    case "faq":
      return t.faq;
    case "about":
      return t.about;
    case "contact":
      return t.contactTitle;
  }
}
export const categoryImageModels = [
  "QC12A00",
  "QC21A00",
  "QC31A00",
  "QC41A00",
  "QC61A00",
  "QC51B00",
];
export function categoryImage(index: number) {
  return (
    products.find((p) => p.model === categoryImageModels[index])?.images[0] ??
    products.find((p) => p.category === categorySlugs[index] && p.images.length)
      ?.images[0]
  );
}
