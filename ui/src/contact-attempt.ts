// Derived from Website Blueprint ab502bf contact-idempotency.ts; local preview adapter.
export type ContactAttempt = Readonly<{
  fingerprint: string;
  idempotencyKey: string;
}>;

export type ContactAttemptStorage = Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
>;

const CONTACT_ATTEMPT_STORAGE_KEY = "qicable.contact.attempt.v1";
const CONTACT_ATTEMPT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const FINGERPRINT_PATTERN = /^sha256:[0-9a-f]{64}$/;
const IDEMPOTENCY_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{15,127}$/;

export function resolveContactAttempt(
  fingerprint: string,
  previous: ContactAttempt | null,
  createKey: () => string = newContactIdempotencyKey,
): ContactAttempt {
  if (previous?.fingerprint === fingerprint) return previous;
  return { fingerprint, idempotencyKey: createKey() };
}

export function newContactIdempotencyKey(): string {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi) throw new Error("secure browser randomness is unavailable");
  if (typeof cryptoApi.randomUUID === "function") return cryptoApi.randomUUID();

  const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function contactFingerprint(payload: string): Promise<string> {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.subtle)
    throw new Error("secure browser hashing is unavailable");
  const digest = await cryptoApi.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(payload),
  );
  const hex = Array.from(new Uint8Array(digest), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
  return `sha256:${hex}`;
}

export function loadStoredContactAttempt(
  storage: ContactAttemptStorage | null,
  now: number = Date.now(),
): ContactAttempt | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(CONTACT_ATTEMPT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return null;
    const record = parsed as Record<string, unknown>;
    if (
      Object.keys(record).sort().join(",") !==
        "createdAt,expiresAt,fingerprint,idempotencyKey" ||
      typeof record.fingerprint !== "string" ||
      typeof record.idempotencyKey !== "string" ||
      typeof record.createdAt !== "number" ||
      typeof record.expiresAt !== "number" ||
      !Number.isSafeInteger(record.createdAt) ||
      !Number.isSafeInteger(record.expiresAt) ||
      record.createdAt < 0 ||
      record.expiresAt - record.createdAt !== CONTACT_ATTEMPT_TTL_MS ||
      !FINGERPRINT_PATTERN.test(record.fingerprint) ||
      !IDEMPOTENCY_KEY_PATTERN.test(record.idempotencyKey)
    ) {
      return null;
    }
    if (record.createdAt > now || now > record.expiresAt) {
      clearStoredContactAttempt(storage);
      return null;
    }
    return {
      fingerprint: record.fingerprint,
      idempotencyKey: record.idempotencyKey,
    };
  } catch {
    return null;
  }
}

export function storeContactAttempt(
  storage: ContactAttemptStorage | null,
  attempt: ContactAttempt,
  now: number = Date.now(),
): void {
  if (!storage) return;
  try {
    storage.setItem(
      CONTACT_ATTEMPT_STORAGE_KEY,
      JSON.stringify({
        ...attempt,
        createdAt: now,
        expiresAt: now + CONTACT_ATTEMPT_TTL_MS,
      }),
    );
  } catch {
    // The in-memory attempt still protects retries while this page remains loaded.
  }
}

export function clearStoredContactAttempt(
  storage: ContactAttemptStorage | null,
): void {
  if (!storage) return;
  try {
    storage.removeItem(CONTACT_ATTEMPT_STORAGE_KEY);
  } catch {
    // A storage-denied browser has no durable attempt to clear.
  }
}
