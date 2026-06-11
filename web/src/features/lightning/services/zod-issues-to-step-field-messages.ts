import type { ZodError } from "zod";

/** 스텝별 `safeParse` 실패 시, 해당 스텝 필드에 대한 첫 에러 메시지 맵 */
export function zodIssuesToStepFieldMessages(
  error: ZodError,
  stepFieldKeys: readonly string[]
): Partial<Record<string, string>> {
  const out: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (
      typeof key === "string" &&
      stepFieldKeys.includes(key) &&
      out[key] === undefined
    ) {
      out[key] = issue.message;
    }
  }

  return out;
}
