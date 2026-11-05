import { getQuoteCatalog } from "./quote-catalog";

export type QuoteLine = { model: string; quantity: string };
export const MAX_QUOTE_LINES = 20;
export const QUOTE_STORAGE_KEY = "qicable-quote-list-v1";
export const isQuoteModel = (model: string) => getQuoteCatalog().some(item => item.model === model);

export class QuoteListError extends Error {
  constructor(public reason: "empty" | "limit" | "model" | "quantity") {
    super(`QUOTE_LIST_${reason.toUpperCase()}`);
    this.name = "QuoteListError";
  }
}

export function parseQuoteList(raw: string | null): QuoteLine[] {
  if (!raw || raw.length > 8192) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !value ||
      typeof value !== "object" ||
      !("version" in value) ||
      value.version !== 1 ||
      !("items" in value) ||
      !Array.isArray(value.items)
    )
      return [];
    const seen = new Set<string>();
    const result: QuoteLine[] = [];
    for (const item of value.items) {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.model !== "string" ||
        !isQuoteModel(item.model) ||
        seen.has(item.model)
      )
        continue;
      seen.add(item.model);
      result.push({
        model: item.model,
        quantity:
          typeof item.quantity === "string" && /^\d{0,6}$/.test(item.quantity)
            ? item.quantity
            : "",
      });
      if (result.length === MAX_QUOTE_LINES) break;
    }
    return result;
  } catch {
    return [];
  }
}

export function validateQuoteLines(lines: readonly QuoteLine[]): void {
  if (!lines.length) throw new QuoteListError("empty");
  if (lines.length > MAX_QUOTE_LINES) throw new QuoteListError("limit");
  const seen = new Set<string>();
  for (const line of lines) {
    if (!isQuoteModel(line.model) || seen.has(line.model))
      throw new QuoteListError("model");
    if (
      line.quantity !== "" &&
      (!/^\d{1,6}$/.test(line.quantity) || Number(line.quantity) < 1)
    )
      throw new QuoteListError("quantity");
    seen.add(line.model);
  }
}

export function remainingQuoteLines(
  current: readonly QuoteLine[],
  submitted: readonly QuoteLine[],
): QuoteLine[] {
  return current.filter(
    (line) =>
      !submitted.some(
        (sent) => sent.model === line.model && sent.quantity === line.quantity,
      ),
  );
}

export function quoteLinesMessage(lines: readonly QuoteLine[]): string {
  validateQuoteLines(lines);
  return [
    "Requested assemblies:",
    ...lines.map(
      (line, index) =>
        `${index + 1}. ${line.model} | Quantity: ${line.quantity ? `${Number(line.quantity)} pcs` : "to confirm"}`,
    ),
  ].join("\n");
}
