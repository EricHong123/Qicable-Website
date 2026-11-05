import { parseServiceRequest } from "./service-requests";
import { quoteLinesMessage, type QuoteLine } from "./quote-list";
export type InquiryInput = {
  name: string;
  email: string;
  company: string;
  message: string;
  phone?: string;
  product?: string;
  type?: string;
  request?: string;
  quantity?: string;
  arrivalDate?: string;
  length?: string;
  environment?: string;
  drawing?: string;
  connectorA?: string;
  connectorB?: string;
  pinout?: string;
  orientation?: string;
  country?: string;
  business?: string;
  stage?: string;
  website?: string;
  quoteItems?: readonly QuoteLine[];
};
export type Attribution = {
  page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};
const byteLength = (value: string) => new TextEncoder().encode(value).length;
const fieldLimits: Record<string, number> = {
  idempotency_key: 128,
  name: 200,
  email: 254,
  company: 200,
  phone: 64,
  message: 4096,
  product: 200,
  page: 2048,
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  website: 200,
};
export class InquirySizeError extends RangeError {
  constructor(public field: string) {
    super("INQUIRY_TOO_LONG");
    this.name = "InquirySizeError";
  }
}
export function inquiryAttribution(
  location: string,
  referrer = "",
): Attribution {
  const current = new URL(location);
  let source = current;
  const from = current.searchParams.get("from");
  if (from?.startsWith("/") && !from.startsWith("//"))
    source = new URL(from, current.origin);
  else if (referrer && /\/contact\/?$/.test(current.pathname)) {
    try {
      const previous = new URL(referrer);
      if (previous.origin === current.origin) source = previous;
    } catch {
      /* Invalid referrers do not override the current page. */
    }
  }
  if (source.origin !== current.origin) source = current;
  const campaign = (key: string) => {
    const value = current.searchParams.get(key) ?? source.searchParams.get(key);
    return value &&
      byteLength(value) <= 200 &&
      !/[\u0000-\u001f\u007f]/.test(value)
      ? value
      : undefined;
  };
  return {
    page: source.origin + source.pathname,
    utm_source: campaign("utm_source"),
    utm_medium: campaign("utm_medium"),
    utm_campaign: campaign("utm_campaign"),
  };
}
export function buildInquiry(
  input: InquiryInput,
  locale: string,
  key: string,
  attribution: Attribution,
  reservedMessageBytes = 0,
) {
  const labels: [string, string | undefined][] = [
    ["Inquiry", input.type],
    ["Request topic", parseServiceRequest(input.request ?? null, input.type ?? "quotation")],
    ["Locale", locale],
    ["Business", input.business],
    ["Country", input.country],
    ["Project stage", input.stage],
    ["Quantity", input.quoteItems ? undefined : input.quantity],
    ["Required arrival date", input.arrivalDate],
    ["Length", input.length],
    ["Installation", input.environment],
    ["Drawing", input.drawing],
    ["Connector A", input.connectorA],
    ["Connector B", input.connectorB],
    ["Pinout", input.pinout],
    ["Orientation / mounting", input.orientation],
  ];
  const message = [
    input.message.trim(),
    ...(input.quoteItems ? [quoteLinesMessage(input.quoteItems)] : []),
    ...labels
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `${k}: ${v!.trim()}`),
  ].join("\n");
  const payload = {
    idempotency_key: key,
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    message,
    phone: input.phone?.trim() || undefined,
    product: input.quoteItems
      ? input.quoteItems.map((item) => item.model).join(", ")
      : input.product?.trim() || undefined,
    page: attribution.page,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    website: input.website || "",
  };
  for (const [field, value] of Object.entries(payload))
    if (
      value !== undefined &&
      byteLength(value) >
        fieldLimits[field] - (field === "message" ? reservedMessageBytes : 0)
    )
      throw new InquirySizeError(field);
  if (byteLength(JSON.stringify(payload)) > 8192 - reservedMessageBytes)
    throw new InquirySizeError("message");
  return payload;
}
