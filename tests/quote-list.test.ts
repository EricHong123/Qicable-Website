import assert from "node:assert/strict";
import { test } from "node:test";
import { products } from "../ui/src/model";
import { buildInquiry } from "../ui/src/contact-contract";
import {
  parseQuoteList,
  QuoteListError,
  remainingQuoteLines,
  validateQuoteLines,
} from "../ui/src/quote-list";

test("quote storage ignores unknown models, duplicates and extra personal data", () => {
  assert.deepEqual(
    parseQuoteList(
      JSON.stringify({
        version: 1,
        items: [
          {
            model: "QC12A00",
            quantity: "25",
            email: "not-retained@example.test",
          },
          { model: "QC12A00", quantity: "4" },
          { model: "UNKNOWN", quantity: "2" },
          { model: "QC21A00", quantity: "oops" },
        ],
      }),
    ),
    [
      { model: "QC12A00", quantity: "25" },
      { model: "QC21A00", quantity: "" },
    ],
  );
  assert.deepEqual(parseQuoteList("broken"), []);
  assert.deepEqual(
    parseQuoteList(JSON.stringify({ version: 2, items: [] })),
    [],
  );
});
test("quote quantities are optional but submitted numbers must be positive whole quantities", () => {
  assert.doesNotThrow(() =>
    validateQuoteLines([{ model: "QC12A00", quantity: "" }]),
  );
  for (const quantity of ["0", "-1", "1.5", "1000000", "NaN"])
    assert.throws(
      () => validateQuoteLines([{ model: "QC12A00", quantity }]),
      QuoteListError,
    );
  assert.throws(() => validateQuoteLines([]), QuoteListError);
  assert.throws(
    () =>
      validateQuoteLines(
        products.slice(0, 21).map((p) => ({ model: p.model, quantity: "1" })),
      ),
    QuoteListError,
  );
});
test("successful submission only consumes unchanged submitted lines", () => {
  assert.deepEqual(
    remainingQuoteLines(
      [
        { model: "QC12A00", quantity: "2" },
        { model: "QC21A00", quantity: "40" },
        { model: "QC51B00", quantity: "5" },
      ],
      [
        { model: "QC12A00", quantity: "2" },
        { model: "QC21A00", quantity: "20" },
      ],
    ),
    [
      { model: "QC21A00", quantity: "40" },
      { model: "QC51B00", quantity: "5" },
    ],
  );
});
test("twenty requested models fit the strict Connector product field and retain per-model quantities", () => {
  const quoteItems = products
    .slice(0, 20)
    .map((p, index) => ({ model: p.model, quantity: index ? "999999" : "" }));
  const payload = buildInquiry(
    {
      name: "QA",
      email: "qa@example.test",
      company: "Fixture",
      message: "Combined request",
      product: "should-not-override-list",
      quantity: "should-not-override-rows",
      quoteItems,
    },
    "ar",
    "batch-quote-test-0001",
    { page: "https://www.qicable.com/ar/contact/" },
    512,
  );
  assert.ok(new TextEncoder().encode(payload.product).length <= 200);
  assert.equal(payload.product?.split(", ").length, 20);
  assert.match(payload.message, /QC10A00 \| Quantity: to confirm/);
  assert.match(payload.message, /QC10A01 \| Quantity: 999999 pcs/);
  assert.ok(!payload.message.includes("should-not-override"));
  assert.ok(!("quoteItems" in payload));
});
