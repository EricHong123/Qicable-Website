/** Export the approved source catalog without publishing or modifying a CMS. */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";
import { products, routes, href } from "../ui/src/model";
import { guideSlugs } from "../ui/src/navigation";
import { guideContent, guideLabels, guideReferences } from "../ui/src/guide-content";
import { locales, messages } from "../ui/src/i18n";
import covers from "../content/blog-covers.json";

const articles = locales.flatMap(locale => guideSlugs.map((slug, index) => {
  const guide = guideContent[locale][index];
  return {
    slug, locale, title: messages[locale].guideNames[index],
    description: guide.lead, excerpt: guide.lead,
    category: messages[locale].guides,
    cover: { src: covers[slug], alt: messages[locale].guideNames[index] },
    sections: [
      ...guide.sections.map(section => ({ heading: section.title, paragraphs: [section.body], qicableRole: "step" })),
      ...(guide.questions ?? []).map(item => ({ heading: item.question, paragraphs: [item.answer], qicableRole: "question" })),
      { heading: guideLabels[locale].mistakes, paragraphs: [], bullets: [...guide.mistakes], qicableRole: "mistakes" },
      { heading: guideLabels[locale].prepare, paragraphs: [], bullets: [...guide.prepare], qicableRole: "prepare" },
    ],
    relatedLinks: guideReferences[index].map(item => ({ label: item.title, href: item.url })),
    qicable: { version: 1, guideIndex: index },
  };
}));
const catalog = products.map(product => ({
  agentCatalog: product.images.length > 0,
  model: product.model, slug: product.slug, name: product.name, family: product.category,
  moq: "", leadTime: "", featured: product.featured,
  applications: [], sellingPoints: [], detailSections: [],
  media: product.images.map(src => ({ src, alt: `${product.model} ${product.name}` })),
  agentSpecifications: { columns: ["Value"], groups: [{ title: "Cable configuration", rows: [
    ["Interface", product.interface],
    ["Connector A", product.connectorA],
    ["Connector B", product.connectorB],
    ["Mounting", product.mounting],
    ["Lengths", product.lengths.join(" / ")],
    ["Subcategory", product.subcategory],
  ].filter(([, value]) => value.trim()).map(([label, value]) => ({ label, values: [value] })) },
    ...(product.engineering.length ? [{title:"Engineering options",rows:product.engineering.map(row=>({label:row.label,values:[row.value]}))}] : []),
  ], notes: [] },
  qicable: { version: 1, source: product },
}));
const archive = { version: 1, site: "https://www.qicable.com", articles, products: catalog };
const output = process.argv[2];
if (!output) throw new Error("An explicit private output file is required");
const path = resolve(output);
mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
const encoded = JSON.stringify(archive, null, 2) + "\n";
writeFileSync(path, encoded, { flag: "wx", mode: 0o600 });
console.log(JSON.stringify({
  articles: articles.length, products: catalog.length,
  canonicalRoutes: new Set(locales.flatMap(locale => routes.map(route => href(locale, route.path)))).size,
  sha256: createHash("sha256").update(encoded).digest("hex"),
}));
