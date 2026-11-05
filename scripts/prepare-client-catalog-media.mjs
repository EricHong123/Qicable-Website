import {readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const products=JSON.parse(await readFile('content/products.json','utf8'));
const sources=JSON.parse(await readFile('evidence/catalog-reconciliation-2026-10-22/selected-assets.json','utf8'));
for(const product of products){const source=sources.find(x=>x.model===product.model);if(!source)continue;const path=source.path.replace(/\.(jpg|jpeg|png)$/i,'.webp');await sharp(source.source).resize({width:1280,height:1280,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile('ui'+path);product.images=[path];}
await writeFile('content/products.json',JSON.stringify(products,null,2)+'\n');
await writeFile('content/active-models.json',JSON.stringify(products.map(x=>x.model))+'\n');
