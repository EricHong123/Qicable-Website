import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import {structuredData} from '../preview/structured-data';
import {routes} from '../ui/src/model';
import {sitemapEntries,publication} from '../ui/src/publication';
test('homepage video metadata points at the real factory WebM without product certification claims',()=>{
 const actual=JSON.parse(readFileSync('evidence/banner-replacement-2026-10-24/video-webm.json','utf8'));
 const video=structuredData(routes.find(r=>r.kind==='home')!,'en')['@graph'].find(n=>n['@type']==='VideoObject')!;
 assert.equal(video.width,actual.streams[0].width);assert.equal(video.height,actual.streams[0].height);assert.equal(video.duration,`PT${Number(actual.format.duration)}S`);assert.equal(actual.streams[0].codec_name,'vp9');assert(!JSON.stringify(video).includes('IP67'));
});
test('image sitemap includes all approved product gallery URLs without enabling preview indexing',()=>{
 assert.deepEqual(sitemapEntries(false),[]);
 const route=routes.find(r=>r.product?.model==='QC10A00')!;
 const review=structuredClone(publication);review.mode="approved-only";review.approvedPaths.en=['/',route.path];
 const previous=route.product!.reviewStatus;
 try{route.product!.reviewStatus='approved';const entry=sitemapEntries(true,review).find(e=>e.url.endsWith(route.path));assert.equal(entry?.images?.length,route.product!.images.length);}finally{route.product!.reviewStatus=previous;}
});
