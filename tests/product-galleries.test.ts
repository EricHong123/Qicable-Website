import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import {products} from '../ui/src/model';
const manifest=JSON.parse(readFileSync('evidence/product-galleries-2026-10-22/conversion.json','utf8'));
test('all supplied still images have a WebP conversion and explicit display disposition',()=>{
 assert.equal(manifest.images,621);assert.equal(manifest.nonImages.length,1);
 assert.equal(manifest.displayed+manifest.held+manifest.duplicates,621);
 for(const row of manifest.records){assert(row.webp.endsWith('.webp'));assert(existsSync(row.webp));}
});
test('gallery paths are unique, model scoped, and have real thumbnails',()=>{
 for(const p of products){assert.equal(p.images.length,new Set(p.images).size);for(const image of p.images){assert(image.includes('/'+p.slug+'-'));assert(existsSync('ui'+image.replace('.webp','.thumb.webp')));}}
 assert.equal(products.reduce((n,p)=>n+p.images.length,0),manifest.displayed);
 const held=manifest.records.filter((r:{held:boolean})=>r.held);
 for(const row of held){assert(!products.filter(p=>p.model===row.model).flatMap(p=>p.images).some(image=>image.includes(row.sourceSha256.slice(0,12))));}
});
