import assert from "node:assert/strict";
import { test } from "node:test";
import { generateLlms } from "../ui/src/llms";
import { routes, href } from "../ui/src/model";
import { pageSeo } from "../ui/src/seo";
import { type Publication } from "../ui/src/publication";
import site from "../config/site.json";

const empty = (): Publication => ({ approvedPaths: { en: [], de: [], es: [], fr: [], pt: [], ar: [],it:[],nl:[],pl:[],cs:[],sv:[],da:[],fi:[],no:[],ru:[],tr:[],ja:[],ko:[],vi:[],id:[] } });
const links = (text: string) => [...text.matchAll(/^\- \[.*\]\((https:\/\/[^)]+)\): .+$/gm)].map(match => match[1]);

test("llms preview never advertises public URLs even with approved pages", () => {
  const review = empty();
  review.approvedPaths.en = ["/", "/products/"];
  const text = generateLlms(false, review);
  assert.match(text, /^# Qicable\n/);
  assert.match(text, /Publication review is pending/);
  assert.doesNotMatch(text, /https?:\/\//);
  assert.deepEqual(links(text), []);
});

test("llms directory follows per-locale approvals and uses existing descriptive metadata", () => {
  const review = empty();
  review.approvedPaths.en = ["/"];
  review.approvedPaths.de = ["/products/"];
  const text = generateLlms(true, review);
  assert.deepEqual(links(text), [site.origin + "/", site.origin + "/de/products/"]);
  assert.ok(text.includes(pageSeo(routes[0], "en").description));
  assert.doesNotMatch(text, /## العربية/);
  assert.deepEqual(links(generateLlms(true, empty())), []);
});

test("llms excludes draft products even when their path is approved", () => {
  const route = routes.find(candidate => candidate.kind === "product")!;
  const review = empty();
  review.approvedPaths.en = [route.path];
  const draft = { ...route, product: { ...route.product!, reviewStatus: "draft" as const } };
  const approved = { ...route, product: { ...route.product!, reviewStatus: "approved" as const } };
  assert.deepEqual(links(generateLlms(true, review, [draft])), []);
  assert.deepEqual(links(generateLlms(true, review, [approved])), [site.origin + route.path]);
});

test("llms localized guides keep their canonical blog paths", () => {
  const guide = routes.find(candidate => candidate.kind === "guide")!;
  const review = empty();
  review.approvedPaths.en = [guide.path];
  review.approvedPaths.de = [guide.path];
  review.approvedPaths.ar = [guide.path];
  const text = generateLlms(true, review);
  assert.deepEqual(links(text), ["en", "de", "ar"].map(locale =>
    site.origin + href(locale as "en" | "de" | "ar", guide.path)));
  assert.ok(text.includes(`/de/blog${guide.path}`));
  assert.ok(text.includes(`/ar/blog${guide.path}`));
});
