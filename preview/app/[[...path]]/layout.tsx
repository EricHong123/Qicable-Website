import { LocaleProvider } from "@ui/locale-provider";
import { clientLocaleStrings } from "@ui/locale-server";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteShell } from "@ui/shell";
import { GoogleAnalytics } from "@ui/analytics-consent";
import { BANNER_POSTER } from "@ui/banner-media";
import { resolveRoute, products } from "@ui/model";
import { nativeContent } from "@ui/native-content";
import "@ui/tokens.css";
export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: "/assets/brand/favicon-32.webp",
        sizes: "32x32",
        type: "image/webp",
      },
      { url: "/assets/brand/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  },
};
export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ path?: string[] }>;
}) {
  const resolved = resolveRoute((await params).path);
  const locale = resolved?.locale ?? "en";
  const localeStrings = clientLocaleStrings(locale);
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
    >
      <head>
        {resolved?.route.path === "/" && <>
          <link rel="preload" as="image" href={BANNER_POSTER} fetchPriority="high" />
          <link rel="preload" as="font" type="font/woff2" crossOrigin="anonymous" href={`/assets/fonts/${locale === "ar" ? "IBMPlexSansArabic" : "IBMPlexSans-Latin"}-Medium.woff2`} />
        </>}
        <link
          rel="preload"
          href={`/assets/fonts/${locale === "ar" ? "IBMPlexSansArabic" : "IBMPlexSans-Latin"}-Regular.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {nativeContent && <script id="qicable-quote-catalog" type="application/json" dangerouslySetInnerHTML={{__html:JSON.stringify(products.map(({model,slug,name})=>({model,slug,name}))).replace(/</g,"\\u003c")}}/>}
        <LocaleProvider locale={locale} strings={localeStrings}><SiteShell locale={locale} path={resolved?.route.path ?? "/"}>
          <main id="main-content">{children}</main>
        </SiteShell></LocaleProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
