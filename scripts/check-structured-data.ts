import assert from "node:assert/strict";
import { readFile, access, mkdir, writeFile } from "node:fs/promises";
import { routes, href, resolveRoute } from "../ui/src/model";
import { locales } from "../ui/src/i18n";

async function main() {
const failures:string[]=[];
const counts:Record<string,number>={};
let pages=0,quotationProducts=0;
for(const locale of locales)for(const route of routes){
 const page=href(locale,route.path);
 if (!resolveRoute(page.split("/").filter(Boolean))) continue;
 const html=await readFile(`preview/out${page}index.html`,"utf8");
 const blocks=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
 if(blocks.length!==1){failures.push(`${page}: expected one server-rendered JSON-LD graph`);continue;}
 try{
  const graph=JSON.parse(blocks[0][1]);
  assert.equal(graph["@context"],"https://schema.org");
  assert.ok(Array.isArray(graph["@graph"])&&graph["@graph"].length>0);
  const ids=new Set<string>();const references:string[]=[];
  const walk=(value:unknown):void=>{
   if(Array.isArray(value)){value.forEach(walk);return;}
   if(!value||typeof value!=="object")return;
   const object=value as Record<string,unknown>;
   if(typeof object["@id"]==="string"){
    if(object["@type"])ids.add(object["@id"]);
    else references.push(object["@id"]);
   }
   Object.values(object).forEach(walk);
  };
  walk(graph["@graph"]);
  for(const id of references)assert.ok(ids.has(id),`unresolved local entity reference ${id}`);
  for(const entity of graph["@graph"]){
   const type=String(entity["@type"]);counts[type]=(counts[type]??0)+1;
   if(type==="BreadcrumbList")assert.ok(entity.itemListElement.length>=2,"breadcrumb rich result needs at least two items");
   if(type==="Product"&&!entity.offers&&!entity.review&&!entity.aggregateRating)quotationProducts++;
  }
 }catch(error){failures.push(`${page}: ${error instanceof Error?error.message:String(error)}`);}
 const head=html.split("</head>")[0];
 for(const [,url] of head.matchAll(/<link\b[^>]*href="(\/assets\/[^"?]+)(?:\?[^\"]*)?"/g)){
  try{await access(`preview/out${url}`);}catch{failures.push(`${page}: missing linked asset ${url}`);}
 }
 pages++;
}
const report={pages,counts,quotationProductsWithoutGoogleSnippetFields:quotationProducts,failures,note:"Local integration validation of JSON-LD syntax, graph links, breadcrumb structure and delivered head assets. This is not an official Schema.org or Google Rich Results Test; quotation-only Product schema remains ineligible for product snippets without genuine offers/reviews/ratings."};
await mkdir("evidence/seo-geo-2026-10-26",{recursive:true});
await writeFile("evidence/seo-geo-2026-10-26/structured-data-static.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));assert.equal(failures.length,0,"Structured data export validation failed");

}
void main().catch(error=>{console.error(error);process.exitCode=1;});
