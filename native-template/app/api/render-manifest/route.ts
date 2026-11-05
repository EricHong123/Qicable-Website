import { createHash, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { routes, href, resolveRoute, products as projectedProducts } from "../../../../ui/src/model";
import { nativeContent } from "../../../../ui/src/native-content";
import { locales } from "../../../../ui/src/i18n";
export const dynamic = "force-dynamic";
const sha = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export function GET(request: Request) {
  const token = process.env.QICABLE_RENDER_TOKEN ?? "";
  const supplied = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${token}`;
  if (token.length < 32 || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied),Buffer.from(expected))) return new Response(null,{status:404});
  if (!nativeContent || !process.env.QICABLE_TEMPLATE_ID || !process.env.QICABLE_CONTENT_SNAPSHOT) throw new Error("Missing pinned renderer inputs");
  const template = process.env.QICABLE_TEMPLATE_ID;
  const content = nativeContent;
  const products = content.products;
  const menu = projectedProducts.map(item => ({model:item.model,name:item.name,family:item.category,interface:item.interface,featured:item.featured,images:item.images}));
  const menuFingerprint = sha(menu);
  const catalogFingerprint = sha(projectedProducts);
  const productsFingerprint = sha(products);
  const records = locales.flatMap(locale => {
    const articles = content.articles.filter(item => item.locale === locale);
    const summaries = articles.map(item => ({slug:item.slug,title:item.title,lead:item.description ?? item.excerpt,cover:item.cover}));
    const summariesFingerprint = sha(summaries);
    return routes.flatMap(route => {
      const url = href(locale,route.path);
      if (!resolveRoute(url.split("/").filter(Boolean))) return [];
      const details = route.kind === "product" ? {own:products.find(item => item.model === route.product?.model),catalog:catalogFingerprint}
        : route.kind === "guide" ? articles.find(item => `/${item.slug}/` === route.path)
        : ["home","catalog","application","applications","resources"].includes(route.kind) ? productsFingerprint : null;
      const translations = route.kind === "guide" ? content.articles.filter(item => `/${item.slug}/` === route.path).map(item => item.locale).sort() : null;
      return [{route:url, canonical:`https://www.qicable.com${url}`,fingerprint:sha({template,locale,path:route.path,menu:menuFingerprint,summaries:summariesFingerprint,details,translations})}];
    });
  });
  const all = sha({template,content:nativeContent});
  records.push(...["/sitemap.xml","/robots.txt","/llms.txt"].map(route => ({route,canonical:`https://www.qicable.com${route}`,fingerprint:all})));
  return Response.json({version:1,site:"https://www.qicable.com",template,snapshotSha256:createHash("sha256").update(readFileSync(process.env.QICABLE_CONTENT_SNAPSHOT)).digest("hex"),routes:records});
}
