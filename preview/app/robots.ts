import type { MetadataRoute } from "next";
import site from "@config/site.json";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(site.indexable ? { allow: "/" } : { disallow: "/" }),
    },
    ...(site.indexable ? { sitemap: site.origin + "/sitemap.xml" } : {}),
  };
}
