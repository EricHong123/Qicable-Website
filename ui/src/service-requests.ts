import type { Locale } from "./i18n";
import { href } from "./navigation";
export const inquiryTypes = ["quotation", "sample", "custom", "document", "support", "partnership"] as const;
export const requestTypes = {
  sample: "sample",
  compatibility: "support",
  installation: "support",
  "order-support": "support",
  partnership: "partnership",
  catalog: "document",
  datasheet: "document",
  drawing: "document",
  wiring: "document",
  testing: "document",
} as const;
export type ServiceRequest = keyof typeof requestTypes;
export const documentRequests = ["catalog", "datasheet", "drawing", "wiring", "testing"] as const;
export function parseServiceRequest(value: string | null, type: string): ServiceRequest | undefined {
  if (!value || !Object.hasOwn(requestTypes, value)) return undefined;
  const key = value as ServiceRequest;
  return requestTypes[key] === type ? key : undefined;
}
export function serviceInquiryHref(locale: Locale, request: ServiceRequest, from: string) {
  const params = new URLSearchParams({ type: requestTypes[request], request, from: href(locale, from) });
  return href(locale, "/contact/") + "?" + params.toString();
}
