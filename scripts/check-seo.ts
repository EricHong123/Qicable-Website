import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { routes, href, resolveRoute } from "../ui/src/model";
import { locales } from "../ui/src/i18n";
import { pageSeo } from "../ui/src/seo";
import { isPageIndexable, pageAlternates, sitemapEntries } from "../ui/src/publication";
import site from "../config/site.json";

const decode=(value:string)=>value.replaceAll("&amp;","&").replaceAll("&quot;",'"').replaceAll("&#x27;","'").replaceAll("&lt;","<").replaceAll("&gt;",">");
const attributes=(tag:string)=>Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([,key,value])=>[key.toLowerCase(),decode(value)]));
async function main() {
const failures:string[]=[];
let duplicateTitlesWithinLocale = 0;
let duplicateDescriptionsWithinLocale = 0;
const check=(ok:unknown,message:string)=>{if(!ok) failures.push(message);};
const lengths:{path:string;title:number;description:number}[]=[];
for(const locale of locales){
 const titles=new Set<string>(),descriptions=new Set<string>();
 for(const route of routes){
  const path=href(locale,route.path);
  if (!resolveRoute(path.split("/").filter(Boolean))) continue;
  const html=await readFile(`preview/out${path}index.html`,"utf8");
  const title=decode(html.match(/<title>([^<]*)<\/title>/)?.[1]??"");
  const metas=[...html.matchAll(/<meta\b[^>]*>/g)].map(([tag])=>attributes(tag));
  const description=metas.find(meta=>meta.name==="description")?.content??"";
  const expected=pageSeo(route,locale);
  check(title===expected.title,`${path}: title differs from expected copy`);
  check(description===expected.description,`${path}: description differs from copy`);
  if (titles.has(title)) duplicateTitlesWithinLocale++;
  if (descriptions.has(description)) duplicateDescriptionsWithinLocale++;
  check(!titles.has(title),`${path}: duplicate title within ${locale}`);
  check(!descriptions.has(description),`${path}: duplicate description within ${locale}`);
  titles.add(title); descriptions.add(description);
  const robots=metas.find(meta=>meta.name==="robots")?.content.split(",").map(v=>v.trim())??[];
  check(robots.includes(isPageIndexable(route,locale)?"index":"noindex"),`${path}: release index directive`);
  const links=[...html.matchAll(/<link\b[^>]*>/g)].map(([tag])=>attributes(tag));
  const actual=Object.fromEntries(links.filter(link=>link.rel==="alternate"&&link.hreflang).map(link=>[link.hreflang,link.href]));
  check(JSON.stringify(Object.entries(actual).sort())===JSON.stringify(Object.entries(pageAlternates(route,locale)).sort()),`${path}: released alternates`);
  const anchors=[...html.matchAll(/<a\b[^>]*>/g)].map(([tag])=>attributes(tag));
  for(const language of locales.filter(language => resolveRoute(href(language,route.path).split("/").filter(Boolean)))) check(anchors.some(a=>a.hreflang===language&&a.href===href(language,route.path)),`${path}: crawlable ${language} link`);
  lengths.push({path,title:title.length,description:description.length});
 }
}
const sitemap=await readFile("preview/out/sitemap.xml","utf8");
const actualUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([,url])=>decode(url)).sort();
check(JSON.stringify(actualUrls)===JSON.stringify(sitemapEntries().map(entry=>entry.url).sort()),"sitemap release eligibility differs from page robots");
const report={pages:lengths.length,indexingEnabled:site.indexable,duplicateTitlesWithinLocale,duplicateDescriptionsWithinLocale,failures,lengthWarnings:lengths.filter(item=>item.title>60||item.description>160),note:"Length warnings are editorial guidance, not Google ranking thresholds. This is static SEO validation, not a live indexing or CWV test."};
await mkdir("evidence/seo-implementation-2026-10-13",{recursive:true});
await writeFile("evidence/seo-implementation-2026-10-13/static-seo.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({pages:report.pages,failures,lengthWarnings:report.lengthWarnings.length,indexingEnabled:report.indexingEnabled},null,2));
assert.equal(failures.length,0,"SEO export verification failed");

}
void main().catch(error => { console.error(error); process.exitCode = 1; });
