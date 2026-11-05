import { pageSeo } from "@ui/seo";
import { isPageIndexable, pageAlternates } from "@ui/publication";
import { structuredData, serializeStructuredData } from "../../structured-data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QicablePage } from "@ui/pages";
import { routes, href, resolveRoute } from "@ui/model";
import { locales } from "@ui/i18n";
import site from "@config/site.json";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    routes.filter(route => resolveRoute(href(locale, route.path).split("/").filter(Boolean))).map((route) => ({
      path: href(locale, route.path).split("/").filter(Boolean),
    })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const data = resolveRoute((await params).path);
  if (!data)
    return { title: "Page not found", robots: { index: false, follow: false } };
  const { route, locale } = data;
  const { title, description } = pageSeo(route, locale);
  const canonical = site.origin + href(locale, route.path);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: pageAlternates(route, locale),
    },
    robots: { index: isPageIndexable(route, locale), follow: site.indexable },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Qicable",
      type: "website",
      locale,
      images: [
        {
          url:
            site.origin +
            (route.product?.images[0] ?? "/assets/brand/logo.webp"),
          alt: title,
        },
      ],
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const data = resolveRoute((await params).path);
  if (!data) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(
            structuredData(data.route, data.locale),
          ),
        }}
      />
      <QicablePage locale={data.locale} route={data.route} />
    </>
  );
}
