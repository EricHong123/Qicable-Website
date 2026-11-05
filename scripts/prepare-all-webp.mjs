import {readdir,stat,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
async function walk(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
const entries=[];
for(const file of await walk('ui/assets')){
 if(!/\.(png|jpe?g|gif)$/i.test(file))continue;
 const target=file.replace(/\.[^.]+$/,'.webp');let exists=true;try{await stat(target);}catch{exists=false;}
 if(!exists){const image=sharp(file,{animated:true});await image.webp({lossless:/certificat/i.test(file),quality:88}).toFile(target);}
 const source=await sharp(file).metadata(),result=await sharp(target).metadata();
 if(result.width>source.width||result.height>source.height)throw new Error(`Unexpected enlargement: ${file}`);
 entries.push({source:file,target,existing:exists,width:result.width,height:result.height,bytes:(await stat(target)).size});
}
await mkdir('evidence/webp-all-2026-10-26',{recursive:true});await writeFile('evidence/webp-all-2026-10-26/conversion.json',JSON.stringify(entries,null,2));console.log(`Prepared ${entries.length} WebP counterparts; originals retained.`);
