import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import {products} from '../ui/src/model';
const inventory=JSON.parse(readFileSync('evidence/catalog-reconciliation-2026-10-22/source-inventory.json','utf8'));
const migration=JSON.parse(readFileSync('content/catalog-migration.json','utf8'));
test('catalog exactly matches the supplied model set without duplicate identities',()=>{
 assert.deepEqual(products.map(p=>p.model).sort(),inventory.rows.map((r:{model:string})=>r.model).sort());
 assert.equal(new Set(products.map(p=>p.slug)).size,80);
 for(const p of products){assert.equal(p.slug,p.model.toLowerCase());assert(p.sourceRow.includes('!'));for(const image of p.images)assert(existsSync('ui'+image));}
});
test('disputed photos stay withheld while table connector definitions are preserved',()=>{
 for(const model of ['QC12A01','QC62C01']){const p=products.find(p=>p.model===model)!;assert.deepEqual(p.images,[]);assert.equal(p.mediaStatus,'pending-review');}
 assert.match(products.find(p=>p.model==='QC12A01')!.connectorB,/USB-B/);
 assert.match(products.find(p=>p.model==='QC62C01')!.connectorB,/DisplayPort/);
});
test('legacy catalog is fully accounted for once across consolidation and retirement',()=>{
 const previous=JSON.parse(readFileSync('evidence/catalog-reconciliation-2026-10-22/products-before.json','utf8'));
 const covered=[...Object.values(migration.consolidations).flat(),...migration.archiveWithoutReplacement];
 assert.equal(covered.length,new Set(covered).size);
 assert.deepEqual(covered.sort(),previous.map((p:{model:string})=>p.model).sort());
});
