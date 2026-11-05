import assert from "node:assert/strict";
import { test } from "node:test";
import {
  attachmentFingerprint,
  attachmentPolicy,
  validateAttachments,
} from "../ui/src/inquiry-attachments";
import {
  buildInquiry,
  inquiryAttribution,
  InquirySizeError,
} from "../ui/src/contact-contract";
import { inquiryMessages, projectStages } from "../ui/src/inquiry-messages";
import { locales } from "../ui/src/i18n";

test("attachment selection enforces quantity, byte size, extension and nonempty names", () => {
  const file = { name: "drawing.pdf", size: attachmentPolicy.maxBytes };
  assert.equal(validateAttachments([file]), null);
  assert.equal(attachmentPolicy.maxBytes, 20 * 1024 * 1024);
  for (const extension of ["step", "stp", "zip"]) assert.equal(validateAttachments([{name:`drawing.${extension}`,size:100}]),null);
  assert.equal(validateAttachments([file, file, file, file]), "fileCount");
  assert.equal(
    validateAttachments([{ ...file, size: file.size + 1 }]),
    "fileSize",
  );
  assert.equal(validateAttachments([{ ...file, size: 0 }]), "fileEmpty");
  assert.equal(
    validateAttachments([{ ...file, name: "drawing.svg" }]),
    "fileType",
  );
  assert.equal(
    validateAttachments([{ ...file, name: "drawing.pdf.exe" }]),
    "fileType",
  );
  assert.equal(
    validateAttachments([{ ...file, name: "图".repeat(70) + ".pdf" }]),
    "fileName",
  );
});
test("same file names with changed bytes have distinct retry fingerprints", async () => {
  const a = new File(["first"], "drawing.pdf");
  const b = new File(["other"], "drawing.pdf");
  assert.notDeepEqual(
    await attachmentFingerprint([a]),
    await attachmentFingerprint([b]),
  );
  assert.deepEqual(
    await attachmentFingerprint([a]),
    await attachmentFingerprint([a]),
  );
});
test("project stage maps into the frozen Connector message and reserves private file references", () => {
  const input = {
    name: "QA",
    email: "qa@example.test",
    company: "Fixture",
    message: "Sample request",
    stage: "prototype",
    product: "QC12A00",
    arrivalDate: "2026-12-01",
  };
  const attr = { page: "https://www.qicable.com/products/qc12a00/" };
  const payload = buildInquiry(input, "de", "test-inquiry-key-001", attr, 512);
  assert.match(payload.message, /Project stage: prototype/);
  assert.match(payload.message, /Required arrival date: 2026-12-01/);
  assert.equal("arrivalDate" in payload, false);
  assert.equal("stage" in payload, false);
  assert.throws(
    () =>
      buildInquiry(
        { ...input, message: "a".repeat(3700) },
        "ar",
        "test-inquiry-key-001",
        attr,
        512,
      ),
    InquirySizeError,
  );
});
test("attachment feedback and project stages cover all six locales", () => {
  for (const locale of locales) {
    assert.deepEqual(
      Object.keys(inquiryMessages[locale]).sort(),
      Object.keys(inquiryMessages.en).sort(),
    );
    assert.equal(inquiryMessages[locale].stages.length, projectStages.length);
    assert.ok(inquiryMessages[locale].help.length > 20);
  }
});
test("floating inquiries retain the current product page instead of the preceding category", () => {
  assert.equal(
    inquiryAttribution(
      "https://www.qicable.com/de/products/qc12a00/",
      "https://www.qicable.com/de/products/machine-vision/",
    ).page,
    "https://www.qicable.com/de/products/qc12a00/",
  );
  assert.equal(
    inquiryAttribution(
      "https://www.qicable.com/contact/",
      "https://www.qicable.com/products/qc12a00/",
    ).page,
    "https://www.qicable.com/products/qc12a00/",
  );
});
