import site from "../../config/site.json";
import { locales, localeNames } from "./i18n";
import { routes, href, type PageRoute } from "./model";
import { isPageIndexable, publication, type Publication } from "./publication";
import { pageSeo } from "./seo";

// Keep Markdown metadata on one line and escape link-label delimiters.
function inline(value: string): string {
  return value.replace(/\s+/g, " ").trim().replace(/[\\[\]]/g, "\\$&");
}

export function generateLlms(
  enabled = site.indexable,
  review: Publication = publication,
  candidates: readonly PageRoute[] = routes,
): string {
  const lines = [`# ${inline(site.brand)}`, ""];
  const approved = locales.map(locale => ({
    locale,
    eligible: candidates.filter(route => isPageIndexable(route, locale, enabled, review)),
  }));
  if (!enabled || !approved.some(({ eligible }) => eligible.length)) {
    return [...lines,
      "> Publication review is pending. No pages are released for public discovery.",
      "",
      "The content directory will be generated from approved pages when publication is enabled. Public access does not imply publication approval.",
      "",
    ].join("\n");
  }
  lines.push(
    "> Industrial cables and custom cable assemblies for equipment manufacturers and system integrators.",
    "",
    review.mode === "all-public"
      ? "This directory lists public website pages under the owner-authorized all-public discovery setting. Directory inclusion does not mark draft product facts or translations as approved."
      : "This directory lists publication-approved pages only. Confirm model-specific configuration and supporting documents before ordering.",
    "",
    "Technical guides are selection checklists, not evidence of a model’s performance or certification. Prices, lead times, minimum order quantities and final configurations are confirmed in the quotation.",
    "",
  );
  for (const { locale, eligible } of approved) {
    if (!eligible.length) continue;
    lines.push(`## ${localeNames[locale]}`, "");
    for (const route of eligible) {
      const { title, description } = pageSeo(route, locale);
      lines.push(`- [${inline(title)}](${site.origin}${href(locale, route.path)}): ${inline(description)}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
