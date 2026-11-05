import assert from "node:assert/strict";
import {test} from "node:test";
import {categoryDisplayOrder,categorySlugs} from "../ui/src/navigation";
import {locales,messages} from "../ui/src/i18n";
import {clientBrief} from "../ui/src/client-brief";
import {categoryContent} from "../ui/src/category-content";
import {products} from "../ui/src/model";
import {buildInquiry} from "../ui/src/contact-contract";

test("customer category display order preserves model identities and six translations",()=>{
 assert.deepEqual(categoryDisplayOrder.map(i=>categorySlugs[i]),['machine-vision','industrial-ethernet','m8-m12','industrial-communication','panel-mount','industrial-display']);
 assert.equal(products.length,80);
 assert.equal(messages.en.heroTitle,"Industrial Cable Assembly Manufacturer");
 for(const locale of locales){
  assert.equal(messages[locale].categories[2],clientBrief[locale].circular);
  assert.equal(categoryContent[locale].families[2].title,clientBrief[locale].circular);
  assert.ok(messages[locale].heroTitle.trim().length > 10);
 }
});
test("engineering details remain in the frozen contact message contract",()=>{
 const result=buildInquiry({name:'Test',company:'Test',email:'qa@example.test',message:'Drawing review',connectorA:'M12',connectorB:'RJ45',pinout:'Drawing A',orientation:'90 degrees'},'en','supplement-test-key-01',{page:'https://www.qicable.com/contact/'});
 assert.match(result.message,/Connector A: M12/);assert.match(result.message,/Pinout: Drawing A/);assert.equal('pinout' in result,false);
});
