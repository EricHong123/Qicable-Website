import assert from 'node:assert/strict';
import {test} from 'node:test';
import {products} from '../ui/src/model';
import {locales} from '../ui/src/i18n';
import {productImageAlt,videoDescriptions} from '../ui/src/media-description';
test('every displayed gallery image has a localized model-specific, distinct description',()=>{
 for(const locale of locales){for(const p of products){const alts=p.images.map((_,index)=>productImageAlt(p,locale,index));assert.equal(alts.length,new Set(alts).size);for(const alt of alts){assert(alt.includes(p.model));assert(!/undefined|fallback|\.webp|\.jpg/.test(alt));}}assert(videoDescriptions[locale].length>30);}
});
