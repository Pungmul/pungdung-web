export function extractTopic(data: unknown): string | undefined {
  if (!data || typeof data !== "object" || !("topic" in data)) {
    return undefined;
  }

  const topic = (data as { topic?: unknown }).topic;
  return typeof topic === "string" ? topic : undefined;
}
