import assert from "node:assert/strict";
import { readdir, mkdir, writeFile } from "node:fs/promises";
const origin="http://127.0.0.1:3101";
async function pagePaths(dir="preview/out", prefix="/") {
 const result=[];
 for(const item of await readdir(dir,{withFileTypes:true})) {
  if(item.isDirectory() && !["404","_not-found","_next","assets"].includes(item.name)) result.push(...await pagePaths(`${dir}/${item.name}`,`${prefix}${item.name}/`));
  else if(item.name==="index.html") result.push({path:prefix});
 }
 return result;
}
const pageRecords=await pagePaths();
const queue=pageRecords.map(page=>page.path);
const failures=[], checks=[];
async function checkPage(path){
 const response=await fetch(origin+path,{redirect:"manual"});
 if(response.status!==200)failures.push(`${path}: HTTP ${response.status}`);
 if(!response.headers.get("x-robots-tag")?.includes("noindex"))failures.push(`${path}: missing preview protection`);
 if(!response.headers.get("cache-control")?.includes("no-cache"))failures.push(`${path}: HTML cache policy`);
 await response.arrayBuffer();
}
await Promise.all(Array.from({length:6},async()=>{for(let path; (path=queue.shift())!==undefined;)await checkPage(path);}));
for(const [path,status] of [["/seo-check-missing/",404],["/assets/seo-check-missing.webp",404],["/about",301]]){
 const response=await fetch(origin+path,{redirect:"manual"});
 checks.push({path,status:response.status,location:response.headers.get("location")});
 if(response.status!==status)failures.push(`${path}: expected ${status}, got ${response.status}`);
 if(status===301 && new URL(response.headers.get("location"),origin).pathname!=="/about/")failures.push("trailing slash target");
 await response.arrayBuffer();
}
const home=await fetch(origin+"/",{headers:{"Accept-Encoding":"gzip"}});
const html=await home.text();
checks.push({path:"/",encoding:home.headers.get("content-encoding"),vary:home.headers.get("vary")});
if(home.headers.get("content-encoding")!=="gzip")failures.push("HTML gzip missing");
const asset=html.match(/src="([^\"]+\/_next\/static\/[^\"]+\.js)"/)?.[1]??html.match(/src="(\/_next\/static\/[^\"]+\.js)"/)?.[1];
if(!asset)failures.push("hashed script not found");
else{
 const response=await fetch(origin+asset,{headers:{"Accept-Encoding":"gzip"}});
 const cache=response.headers.get("cache-control");
 checks.push({path:asset,status:response.status,cache,encoding:response.headers.get("content-encoding")});
 if(response.status!==200||!cache?.includes("max-age=31536000"))failures.push("hashed asset cache");
 await response.arrayBuffer();
}
const report={origin,pages:pageRecords.length,checks,failures,note:"Local static gateway only. No production TLS, DNS, Search Console or real-user CWV claim."};
await mkdir("evidence/seo-completion-2026-10-14",{recursive:true});
await writeFile("evidence/seo-completion-2026-10-14/http.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({...report,failures:failures.slice(0,15),failureCount:failures.length},null,2));
assert.equal(failures.length,0,"Local HTTP verification failed");
