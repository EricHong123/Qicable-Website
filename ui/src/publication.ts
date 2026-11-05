import { z } from "zod";
import site from "../../config/site.json";
import publicationData from "../../config/publication.json";
import { routes, href, type PageRoute } from "./model";
import { locales, type Locale } from "./i18n";
import { nativeContent, nativeArticle } from "./native-content";

const knownPath = z.string().refine(path => routes.some(route => route.path === path), "Unknown logical publication path");
const paths = z.array(knownPath).refine(values => new Set(values).size === values.length, "Duplicate publication path");
export const publicationSchema = z.object({
  mode: z.enum(["approved-only", "all-public"]).optional(),
  approvedPaths: z.object(Object.fromEntries(locales.map(locale => [locale, paths])) as Record<Locale, typeof paths>).strict(),
}).strict();
export type Publication = z.infer<typeof publicationSchema>;
export const publication = publicationSchema.parse(publicationData);

export function isPageIndexable(route:PageRoute, locale:Locale, enabled = site.indexable, review:Publication = publication):boolean {
  if (nativeContent && route.kind === "guide" && !nativeArticle(locale,route.path.slice(1,-1))) return false;
  return enabled && (review.mode === "all-public" || (review.approvedPaths[locale].includes(route.path)
    && (!route.product || route.product.reviewStatus === "approved")));
}
export function pageAlternates(route:PageRoute, locale:Locale, enabled = site.indexable, review:Publication = publication):Record<string,string> {
  // Preview exposes all variants for testing; public alternates follow the owner-selected discovery policy.
  if (enabled && !isPageIndexable(route,locale,enabled,review)) return {};
  const eligible = locales.filter(l => !enabled || isPageIndexable(route,l,enabled,review));
  return Object.fromEntries([
    ...eligible.map(l => [l,site.origin + href(l,route.path)]),
    ...(eligible.includes("en") ? [["x-default",site.origin + route.path]] : []),
  ]);
}
export function sitemapEntries(enabled = site.indexable, review:Publication = publication) {
  if (!enabled) return [];
  if (!isPageIndexable(routes[0],"en",enabled,review)) {
    throw new Error("SEO release blocked: approve the English home page in config/publication.json before enabling indexing.");
  }
  return routes.flatMap(route => locales.filter(locale => isPageIndexable(route,locale,enabled,review)).map(locale => ({
    url:site.origin + href(locale,route.path),
    ...(route.product ? {images:route.product.images.map(image=>site.origin+image)} : {}),
    alternates:{languages:pageAlternates(route,locale,enabled,review)},
  })));
}
