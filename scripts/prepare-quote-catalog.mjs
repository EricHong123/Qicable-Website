import { readFile, writeFile } from 'node:fs/promises';
const products=JSON.parse(await readFile('content/products.json','utf8'));
await writeFile('content/quote-catalog.json',JSON.stringify(products.map(({model,slug,name})=>({model,slug,name})))+'\n');
await writeFile('content/active-models.json',JSON.stringify(products.map(p=>p.model))+'\n');
