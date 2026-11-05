"use client";
import { useSyncExternalStore } from "react";
import {
  isQuoteModel,
  MAX_QUOTE_LINES,
  parseQuoteList,
  QUOTE_STORAGE_KEY,
  remainingQuoteLines,
  type QuoteLine,
} from "./quote-list";

type Snapshot = { items: readonly QuoteLine[]; persistent: boolean };
const empty: Snapshot = { items: [], persistent: true };
let snapshot = empty;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}
function readStorage(): Snapshot {
  try {
    return {
      items: parseQuoteList(window.localStorage.getItem(QUOTE_STORAGE_KEY)),
      persistent: true,
    };
  } catch {
    return { ...snapshot, persistent: false };
  }
}
function refresh() {
  // A failed write can leave readable but stale storage; keep the current draft.
  if (!snapshot.persistent) return;
  const next = readStorage();
  if (JSON.stringify(snapshot) !== JSON.stringify(next)) {
    snapshot = next;
    notify();
  }
}
function onStorage(event: StorageEvent) {
  if (event.key === QUOTE_STORAGE_KEY || event.key === null) refresh();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("storage", onStorage);
    refresh();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("storage", onStorage);
  };
}
const getSnapshot = () => snapshot;
export function useQuoteList() {
  return useSyncExternalStore(subscribe, getSnapshot, () => empty);
}

function commit(change: (items: readonly QuoteLine[]) => readonly QuoteLine[]) {
  const latest = snapshot.persistent ? readStorage() : snapshot;
  const items = change(latest.items);
  let persistent = true;
  try {
    window.localStorage.setItem(
      QUOTE_STORAGE_KEY,
      JSON.stringify({ version: 1, items }),
    );
  } catch {
    persistent = false;
  }
  snapshot = { items, persistent };
  notify();
}
export function addQuoteModel(model: string): boolean {
  if (!isQuoteModel(model)) return false;
  let added = true;
  commit((items) => {
    if (items.some((item) => item.model === model)) return items;
    if (items.length >= MAX_QUOTE_LINES) {
      added = false;
      return items;
    }
    return [...items, { model, quantity: "" }];
  });
  return added;
}
export function updateQuoteQuantity(model: string, quantity: string) {
  if (!/^\d{0,6}$/.test(quantity)) return;
  commit((items) =>
    items.map((item) => (item.model === model ? { ...item, quantity } : item)),
  );
}
export function removeQuoteModel(model: string) {
  commit((items) => items.filter((item) => item.model !== model));
}
export function removeSubmittedQuotes(submitted: readonly QuoteLine[]) {
  commit((items) => remainingQuoteLines(items, submitted));
}
