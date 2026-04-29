import type { ResponseEnvelope } from "../src/protocol";

export function withOptionalCommandId(
  message: ResponseEnvelope,
  commandId: string | null
): ResponseEnvelope {
  if (!commandId) {
    return message;
  }
  return { ...message, commandId };
}

export function safeParseMessageBody(body: string): unknown {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return body;
  }
}

export function formatWorkerError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
