/**
 * 백엔드가 JSON 에러 응답에서 내려주는 코드 필드를 추출한다.
 * (errorCode / code / error 및 nested `response` 내 동일 필드)
 */
export function extractErrorCode(payload: unknown): string | number | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as Record<string, unknown>;
  const candidates = [data.errorCode, data.code, data.error];
  const response =
    data.response && typeof data.response === "object"
      ? (data.response as Record<string, unknown>)
      : null;

  if (response) {
    candidates.push(response.errorCode, response.code);
  }

  for (const candidate of candidates) {
    if (typeof candidate === "string" || typeof candidate === "number") {
      return candidate;
    }
  }

  return null;
}
