export function normalizeEnvelopeInput(raw: unknown): unknown {
  if (typeof raw !== "object" || raw === null) {
    return raw;
  }

  const rec = raw as Record<string, unknown>;
  if (typeof rec.code === "string") {
    return rec;
  }
  if (typeof rec.responseCode === "string") {
    return { ...rec, code: rec.responseCode };
  }
  return rec;
}
