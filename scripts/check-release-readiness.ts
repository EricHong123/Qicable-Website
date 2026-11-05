import { mkdir, writeFile } from "node:fs/promises";
import site from "../config/site.json";
import { routes, products, href } from "../ui/src/model";
import { locales } from "../ui/src/i18n";
import { publication, isPageIndexable } from "../ui/src/publication";

async function main(){
 const pages=locales.flatMap(locale=>routes.map(route=>({path:href(locale,route.path),locale,kind:route.kind,translationApproved:publication.approvedPaths[locale].includes(route.path),factsApproved:!route.product||route.product.reviewStatus==="approved",eligibleWhenEnabled:isPageIndexable(route,locale,true)})));
 const blockers=[
  ...(!site.indexable?["Production indexing is intentionally disabled in local preview."]:[]),
  ...products.filter(product=>product.reviewStatus!=="approved").map(product=>`${product.model}: factual review and source documents are still required.`),
  `${pages.filter(page=>!page.translationApproved).length} localized pages have no release approval.`,
  "Production domain, HTTPS, redirects, SMTP and Search Console need verification in the actual deployment environment.",
 ];
 const report={mode:"local release dry run",readyForProduction:false,localScope:"Preparation only; never grants content approval or enables indexing.",eligiblePages:pages.filter(page=>page.eligibleWhenEnabled).length,blockers,pages};
 const directory="evidence/seo-completion-2026-10-14";
 await mkdir(directory,{recursive:true});
 await writeFile(`${directory}/release-readiness.json`,JSON.stringify(report,null,2)+"\n");
 const rows=["model,priority,fact_review,source_url,images,missing_review_items",...products.map(product=>[product.model,product.featured?"priority":"secondary",product.reviewStatus,product.sourceUrl??"",String(product.images.length),"Confirm connector and pinout; dimensions and drawing revision; model-matched source image; model-specific limits"].map(value=>'"'+value.replaceAll('"','""')+'"').join(","))];
 await writeFile(`${directory}/product-review-queue.csv`,"\ufeff"+rows.join("\n")+"\n");
 console.log(JSON.stringify({mode:report.mode,readyForProduction:false,eligiblePages:report.eligiblePages,productReviews:products.filter(product=>product.reviewStatus!=="approved").length,pageReviews:pages.filter(page=>!page.translationApproved).length},null,2));
}
void main().catch(error=>{console.error(error);process.exitCode=1;});
