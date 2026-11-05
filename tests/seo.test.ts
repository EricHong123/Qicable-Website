import assert from "node:assert/strict";
import { test } from "node:test";
import { routes, products, href } from "../ui/src/model";
import { locales, messages } from "../ui/src/i18n";
import { pageSeo } from "../ui/src/seo";
import { isPageIndexable, pageAlternates, publicationSchema, sitemapEntries, type Publication } from "../ui/src/publication";
import { structuredData } from "../preview/structured-data";
import { categoryContent } from "../ui/src/category-content";
import site from "../config/site.json";

const review:Publication = {approvedPaths:{en:["/","/products/qc12a00/"],de:["/"],es:[],fr:[],pt:[],ar:[],it:[],nl:[],pl:[],cs:[],sv:[],da:[],fi:[],no:[],ru:[],tr:[],ja:[],ko:[],vi:[],id:[]}};
test("release eligibility keeps preview private, filters draft products, and matches reciprocal sitemap alternates",()=>{
 const home=routes[0];
 assert.equal(isPageIndexable(home,"en",false,review),false);
 assert.deepEqual(sitemapEntries(false,review),[]);
 assert.equal(isPageIndexable(home,"en",true,review),true);
 assert.equal(isPageIndexable(home,"ar",true,review),false);
 const draft=routes.find(r=>r.product?.model==="QC12A00")!;
 assert.equal(isPageIndexable(draft,"en",true,review),false);
 const approved={...draft,product:{...draft.product!,reviewStatus:"approved" as const}};
 assert.equal(isPageIndexable(approved,"en",true,review),true);
 assert.equal(isPageIndexable(approved,"de",true,review),false);
 assert.deepEqual(pageAlternates(draft,"en",true,review),{});
 const map=pageAlternates(home,"en",true,review);
 assert.deepEqual(map,{en:site.origin+"/",de:site.origin+"/de/","x-default":site.origin+"/"});
 assert.deepEqual(pageAlternates(home,"de",true,review),map);
 assert.deepEqual(sitemapEntries(true,review).map(e=>e.url),[site.origin+"/",site.origin+"/de/"]);
 assert.throws(()=>sitemapEntries(true,{approvedPaths:{en:[],de:[],es:[],fr:[],pt:[],ar:[],it:[],nl:[],pl:[],cs:[],sv:[],da:[],fi:[],no:[],ru:[],tr:[],ja:[],ko:[],vi:[],id:[]}}),/approve the English home/);
 assert.equal(Object.keys(pageAlternates(home,"en",false,review)).length,locales.length+1);
});
test("publication review rejects misspelled URLs, locales and duplicate approvals",()=>{
 assert.throws(()=>publicationSchema.parse({approvedPaths:{...review.approvedPaths,en:["/typo/"]}}));
 assert.throws(()=>publicationSchema.parse({approvedPaths:{...review.approvedPaths,xx:["/"]}}));
 assert.throws(()=>publicationSchema.parse({approvedPaths:{...review.approvedPaths,en:["/","/"]}}));
});
test("all six languages have unique per-intent metadata without footer-description fallbacks",()=>{
 for(const locale of locales){
  const titles=new Set<string>(); const descriptions=new Set<string>();
  for(const route of routes){
   const copy=pageSeo(route,locale);
   assert.ok(copy.title.trim()&&copy.description.trim(),href(locale,route.path));
   assert.ok(!titles.has(copy.title),`${locale} duplicate title: ${copy.title}`);
   assert.ok(!descriptions.has(copy.description),`${locale} duplicate description: ${route.path}`);
   assert.notEqual(copy.description,messages[locale].footerText);
   titles.add(copy.title);descriptions.add(copy.description);
  }
  assert.equal(categoryContent[locale].families.length,6);
 }
});
test("Product schema uses visible connector facts without invented commercial properties",()=>{
 for(const locale of locales) for(const product of products){
  const route=routes.find(r=>r.product?.model===product.model)!;
  const graph=structuredData(route,locale)["@graph"];
  const entity=graph.find(e=>e["@type"]==="Product")!;
  assert.match(String(entity.description),new RegExp(product.model));
  assert.ok(String(entity.description).includes(product.connectorA));
  assert.ok(String(entity.description).includes(product.connectorB));
  assert.equal(entity.offers,undefined);assert.equal(entity.aggregateRating,undefined);
  assert.deepEqual(graph.find(e=>e["@type"]==="WebPage")!.mainEntity,{"@id":entity["@id"]});
 }
});

import { relatedProducts } from "../ui/src/product-relations";
test("related products prioritize recorded connections, exclude self and other families, and do not mutate the catalog",()=>{
 const original=products.map(p=>p.model);
 const product=products.find(p=>p.model==="QC31A00")!;
 const matches=relatedProducts(product,products);
 assert.equal(matches.length,3);
 assert.ok(matches.every(p=>p.model!==product.model && p.category===product.category));
 assert.equal(matches[0].interface,product.interface);
 assert.deepEqual(products.map(p=>p.model),original);
 assert.deepEqual(relatedProducts(product,[product]),[]);
});


test("owner-authorized all-public discovery includes every locale without changing factual review status", () => {
 const all:Publication={mode:"all-public",approvedPaths:{en:[],de:[],es:[],fr:[],pt:[],ar:[],it:[],nl:[],pl:[],cs:[],sv:[],da:[],fi:[],no:[],ru:[],tr:[],ja:[],ko:[],vi:[],id:[]}};
 const draft=routes.find(route=>route.product?.reviewStatus==="draft")!;
 assert.ok(draft);
 assert.equal(isPageIndexable(draft,"ar",false,all),false);
 assert.equal(isPageIndexable(draft,"ar",true,all),true);
 assert.equal(sitemapEntries(true,all).length,routes.length*locales.length);
 assert.equal(Object.keys(pageAlternates(draft,"ar",true,all)).length,locales.length+1);
 assert.equal(draft.product?.reviewStatus,"draft");
});
