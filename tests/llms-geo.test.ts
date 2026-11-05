import assert from "node:assert/strict";
import { test } from "node:test";
import { generateLlms } from "../ui/src/llms";
import { routes, href } from "../ui/src/model";
import { locales, localeNames } from "../ui/src/i18n";
import type { Publication } from "../ui/src/publication";
import site from "../config/site.json";

const emptyReview = (): Publication => ({ approvedPaths: { en: [], de: [], es: [], fr: [], pt: [], ar: [],it:[],nl:[],pl:[],cs:[],sv:[],da:[],fi:[],no:[],ru:[],tr:[],ja:[],ko:[],vi:[],id:[] } });

test("a public but unapproved website is described as review-pending, not local-only", () => {
  const pending = generateLlms(true, emptyReview());
  assert.match(pending, /Publication review is pending/);
  assert.match(pending, /Public access does not imply publication approval/);
  assert.doesNotMatch(pending, /local preview/i);
  assert.doesNotMatch(pending, /https?:\/\//);
});

test("an enabled directory retains approved paths for all six languages and qualification scope", () => {
  const review = emptyReview();
  for (const locale of locales) review.approvedPaths[locale] = ["/"];
  const text = generateLlms(true, review, [routes[0]]);
  for (const locale of locales) {
    assert.ok(text.includes(`## ${localeNames[locale]}`));
    assert.ok(text.includes(`](${site.origin}${href(locale, "/")})`));
  }
  assert.match(text, /selection checklists, not evidence of a model’s performance or certification/);
  assert.match(text, /confirmed in the quotation/);
  assert.doesNotMatch(text, /cms\.qicable|agent\.qicable/);
});

test("owner-authorized all-public discovery includes draft model URLs without approving their facts", () => {
  const route = routes.find(candidate => candidate.kind === "product")!;
  const draft = { ...route, product: { ...route.product!, reviewStatus: "draft" as const } };
  const review: Publication = { ...emptyReview(), mode: "all-public" };
  const text = generateLlms(true, review, [draft]);
  for (const locale of locales) {
    assert.ok(text.includes(`](${site.origin}${href(locale, draft.path)})`));
  }
  assert.match(text, /owner-authorized all-public discovery/);
  assert.match(text, /does not mark draft product facts or translations as approved/);
  assert.doesNotMatch(text, /publication-approved pages only/);
  assert.equal(draft.product.reviewStatus, "draft");
  assert.doesNotMatch(generateLlms(false, review, [draft]), /https?:\/\//);
});
