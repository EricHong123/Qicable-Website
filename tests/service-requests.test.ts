import { test } from "node:test";
import assert from "node:assert/strict";
import { parseServiceRequest, serviceInquiryHref, requestTypes } from "../ui/src/service-requests";
import { buildInquiry, inquiryAttribution } from "../ui/src/contact-contract";
import { locales } from "../ui/src/i18n";

test("service CTAs preserve the intended topic and localized source through the Connector message", () => {
  for (const locale of locales) for (const [request,type] of Object.entries(requestTypes)) {
    const path=serviceInquiryHref(locale,request as keyof typeof requestTypes,"/technical-support/");
    const url=new URL(path,"https://www.qicable.com");
    assert.equal(url.searchParams.get("type"), type);
    const payload=buildInquiry({name:"QA",email:"qa@example.com",company:"QA",message:"Please review this model.",type:url.searchParams.get("type")!,request:url.searchParams.get("request")!},locale,"test-idempotency-key",inquiryAttribution(url.href));
    assert.match(payload.message,new RegExp(`Request topic: ${request}`));
    assert.equal(payload.page,`https://www.qicable.com${locale==="en"?"":"/"+locale}/technical-support/`);
    assert.equal(Object.hasOwn(payload,"request"),false,"strict Connector contract uses message, not a new field");
  }
});
test("unknown request values and mismatched inquiry types cannot inject a topic", () => {
  for(const value of ["__proto__","constructor","unknown","testing\nInjected: true",null]) assert.equal(parseServiceRequest(value,"document"),undefined);
  assert.equal(parseServiceRequest("sample","partnership"),undefined);
  const payload=buildInquiry({name:"QA",email:"qa@example.com",company:"QA",message:"Help",type:"quotation",request:"order-support"},"en","test-idempotency-key",{page:"https://www.qicable.com/contact/"});
  assert.equal(payload.message.includes("Request topic:"),false);
});
