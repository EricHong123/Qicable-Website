import { bannerVideoCopy, videoDescriptions } from "../ui/src/media-description";
import { pageSeo, productSummary } from "../ui/src/seo";
import { guideContent, guideReferences } from "../ui/src/guide-content";
import { nativeContent, nativeArticle } from "../ui/src/native-content";
import { companyContent } from "../ui/src/company-content";
import site from "../config/site.json";
import social from "../config/social-links.json";
import {
  categorySlugs,
  guideSlugs,
  products,
  href,
  pageTitle,
  productName,
  type PageRoute,
} from "../ui/src/model";
import { messages, type Locale } from "../ui/src/i18n";

type Entity = Record<string, unknown>;

export function structuredData(route: PageRoute, locale: Locale) {
  const url = site.origin + href(locale, route.path);
  const pageId = url + "#webpage";
  const organizationId = site.origin + "/#organization";
  const websiteId = site.origin + "/#website";
  const brandId = site.origin + "/#brand";
  // Localized product pages describe the same model, not six different products.
  const productId = site.origin + href("en", route.path) + "#product";
  const organization: Entity = {
    "@type": "Organization",
    "@id": organizationId,
    name: site.brand,
    legalName: site.legalName,
    url: site.origin + "/",
    description: pageSeo({ path: "/", kind: "home" }, locale).description,
    email: site.email,
    telephone: site.phone,
    logo: {
      "@type": "ImageObject",
      "@id": site.origin + "/#logo",
      url: site.origin + "/assets/brand/logo.webp",
      contentUrl: site.origin + "/assets/brand/logo.webp",
    },
    address: site.address,
    brand: { "@id": brandId },
    // The supplied LinkedIn link is a person's profile, not this organization.
    sameAs: [social.facebook, social.youtube, social.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.email,
      telephone: site.phone,
      url: site.origin + "/contact/",
    },
  };
  const article = route.kind === "guide" ? nativeArticle(locale, route.path.slice(1,-1)) : undefined;
  const citations = route.kind === "guide"
    ? (article ? article.relatedLinks?.map(item => ({title:item.label,url:item.href})) ?? [] : guideReferences[route.index!] ?? []).map(source => ({
        "@type": "CreativeWork", name: source.title, url: source.url,
      }))
    : undefined;
  const page: Entity = {
    "@type": route.kind === "about" ? "AboutPage"
      : route.kind === "contact" ? "ContactPage"
      : route.kind === "faq" ? "FAQPage"
      : ["catalog", "applications", "resources", "guides"].includes(route.kind)
        ? "CollectionPage" : "WebPage",
    "@id": pageId,
    url,
    name: pageTitle(route, locale),
    description: pageSeo(route, locale).description,
    inLanguage: locale,
    publisher: { "@id": organizationId },
    ...(route.kind === "about" ? { about: { "@id": organizationId } } : {}),
    ...(citations ? { citation: citations } : {}),
    ...(route.product ? { mainEntity: { "@id": productId } } : {}),
    isPartOf: { "@id": websiteId },
  };
  const graph: Entity[] = [
    organization,
    { "@type": "Brand", "@id": brandId, name: site.brand },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.origin + "/",
      name: site.brand,
      inLanguage: site.locales,
      publisher: { "@id": organizationId },
    },
    page,
  ];

  // Google's breadcrumb feature requires at least two items. A homepage has
  // no ancestor trail, so emitting a one-item BreadcrumbList is misleading.
  if (route.kind !== "home") {
    const breadcrumbs = [
      { name: messages[locale].home, item: site.origin + href(locale, "/") },
    ];
    if (route.kind === "product") {
      breadcrumbs.push({
        name: messages[locale].categories[
          categorySlugs.indexOf(route.product!.category)
        ],
        item: site.origin + href(locale, `/products/${route.product!.category}/`),
      });
    }
    breadcrumbs.push({ name: pageTitle(route, locale), item: url });
    page.breadcrumb = { "@id": url + "#breadcrumb" };
    graph.push({
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumb",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        ...item,
      })),
    });
  }

  if (route.kind === "home") {
    page.video = { "@id": url + "#banner-video" };
    graph.push({
      "@type":"VideoObject", "@id":url+"#banner-video",
      name:bannerVideoCopy[locale].title,
      description:videoDescriptions[locale],
      thumbnailUrl:site.origin+"/assets/videos/qicable-factory-tour-poster.webp",
      contentUrl:site.origin+"/assets/videos/qicable-factory-tour-1920x960.webm",
      encodingFormat:"video/webm", duration:"PT19.333S", uploadDate:"2026-10-24T00:00:00+08:00",
      width:1920, height:960, isPartOf:{"@id":pageId},
      publisher:{"@id":organizationId},
    });
  }

  if (route.kind === "faq") {
    const questions = [
      ...messages[locale].faqQuestions.map((question, index) => ({
        question, answer: messages[locale].faqAnswers[index],
      })),
      ...companyContent[locale].faq,
    ];
    page.mainEntity = questions.map(({ question, answer }, index) => ({
      "@type": "Question",
      "@id": url + `#question-${index + 1}`,
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    }));
  }

  if (route.kind === "guide") {
    const articleId = url + "#article";
    page.mainEntity = { "@id": articleId };
    graph.push({
      "@type": "Article",
      "@id": articleId,
      url,
      headline: pageTitle(route, locale),
      description: article?.description ?? guideContent[locale][route.index!]?.lead ?? "",
      inLanguage: locale,
      articleSection: messages[locale].guides,
      publisher: { "@id": organizationId },
      mainEntityOfPage: { "@id": pageId },
      citation: citations,
      // The page has no attributed byline or publication/revision timestamps.
      // Do not manufacture those recommended Article properties for a test.
    });
  }

  if (route.kind === "catalog" || route.kind === "guides") {
    const items = route.kind === "catalog"
      ? products
          .filter(product => route.index === undefined || product.category === categorySlugs[route.index])
          .map(product => ({
            name: `${product.model} · ${productName(product, locale)}`,
            url: site.origin + href(locale, `/products/${product.slug}/`),
          }))
      : nativeContent ? nativeContent.articles.filter(item => item.locale === locale).map(item => ({name:item.title,url:site.origin+href(locale,`/${item.slug}/`)})) : guideSlugs.map((slug, index) => ({
          name: messages[locale].guideNames[index],
          url: site.origin + href(locale, `/${slug}/`),
        }));
    const listId = url + "#items";
    page.mainEntity = { "@id": listId };
    graph.push({
      "@type": "ItemList",
      "@id": listId,
      numberOfItems: items.length,
      itemListOrder: "https://schema.org/ItemListUnordered",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": "WebPage", ...item },
      })),
    });
  }

  if (route.product) {
    const product = route.product;
    const image = product.images.map(image => site.origin + image);
    if (image[0]) {
      page.primaryImageOfPage = { "@type": "ImageObject", url: image[0] };
    }
    graph.push({
      "@type": "Product",
      "@id": productId,
      name: productName(product, locale),
      sku: product.model,
      model: product.model,
      url,
      image,
      brand: { "@id": brandId },
      category: messages[locale].categories[categorySlugs.indexOf(product.category)],
      mainEntityOfPage: { "@id": pageId },
      description: productSummary(product, locale),
      additionalProperty: [
        [messages[locale].connectorA, product.connectorA],
        [messages[locale].connectorB, product.connectorB],
        [messages[locale].interface, product.interface],
      ].map(([name, value]) => ({"@type": "PropertyValue", name, value})),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}
