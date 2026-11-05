import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";
import data from "../content/responsive-images.json";
test("responsive assets preserve source aspect ratios and never enlarge originals",async()=>{
 for(const [src,image] of Object.entries(data)){
  const source=await sharp("ui"+src).metadata();
  assert.equal(source.width,image.width); assert.equal(source.height,image.height);
  const seen=new Set<number>();
  for(const candidate of image.srcSet.split(", ")){
   const [url,descriptor]=candidate.split(" "); const width=Number.parseInt(descriptor);
   assert.ok(!seen.has(width)); seen.add(width);
   assert.ok(width<=image.width); assert.ok(existsSync("ui"+url));
   const actual=await sharp("ui"+url).metadata(); assert.equal(actual.width,width);
   assert.ok(Math.abs(actual.height!-image.height*width/image.width)<=1);
   if(url!==src)assert.ok(statSync("ui"+url).size<statSync("ui"+src).size);
  }
 }
});
