import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';
const inventory=JSON.parse(await readFile('evidence/catalog-reconciliation-2026-10-22/source-inventory.json','utf8'));
const products=JSON.parse(await readFile('content/products.json','utf8'));
const selected=JSON.parse(await readFile('evidence/catalog-reconciliation-2026-10-22/selected-assets.json','utf8'));
const sourceRoot='/Users/trademax/Desktop/Qicable 产品线建站资料';
const archive='../客户资料/2026-10-22产品资料/webp';
await mkdir(archive,{recursive:true});
await mkdir('evidence/product-galleries-2026-10-22',{recursive:true});
const records=[];
for(const product of products){
 const files=inventory.files.filter(f=>f.path.split('/')[1]===product.model&&/\.(jpg|jpeg|png|webp)$/i.test(f.path)).sort((a,b)=>a.path.localeCompare(b.path,undefined,{numeric:true}));
 const primary=selected.find(s=>s.model===product.model);
 files.sort((a,b)=>Number(path.join(sourceRoot,b.path)===primary?.source)-Number(path.join(sourceRoot,a.path)===primary?.source));
 const images=[];const seen=new Set();
 for(const file of files){
  const input=await readFile(path.join(sourceRoot,file.path));
  assert.equal(createHash('sha256').update(input).digest('hex'),file.sha256,'Source changed: '+file.path);
  const name=product.model.toLowerCase()+'-'+file.sha256.slice(0,12)+'.webp';
  const held=['QC12A01','QC62C01'].includes(product.model) || file.path==='Industrial Display Cables/QC62B02/QC62B02 (4).jpg';
  const destination=held?path.join(archive,name):'ui/assets/products/'+name;
  const metadata=await sharp(input).metadata();
  await sharp(input).rotate().resize({width:1280,height:1280,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(destination);
  const duplicate=seen.has(file.sha256);seen.add(file.sha256);
  if(!held&&!duplicate){images.push('/assets/products/'+name);await sharp(input).rotate().resize({width:160,height:128,fit:'inside',withoutEnlargement:true}).webp({quality:78}).toFile(destination.replace('.webp','.thumb.webp'));}
  records.push({model:product.model,source:file.path,sourceSha256:file.sha256,width:metadata.width,height:metadata.height,webp:destination,held,duplicate,displayed:!held&&!duplicate});
 }
 product.images=images;
}
await writeFile('content/products.json',JSON.stringify(products,null,2)+'\n');
await writeFile('evidence/product-galleries-2026-10-22/conversion.json',JSON.stringify({records,images:records.length,displayed:records.filter(r=>r.displayed).length,held:records.filter(r=>r.held).length,duplicates:records.filter(r=>r.duplicate&&!r.held).length,nonImages:inventory.files.filter(f=>! /\.(jpg|jpeg|png|webp)$/i.test(f.path))},null,2)+'\n');
console.log(JSON.stringify({images:records.length,displayed:records.filter(r=>r.displayed).length,held:records.filter(r=>r.held).length}));
