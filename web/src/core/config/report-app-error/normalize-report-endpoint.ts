import { validate as isUuid } from "uuid";

// 이슈 제목/fingerprint용 경로
// 쿼리 제거, 숫자/UUID 세그먼트는 {id}
export function normalizeReportEndpoint(
  endpoint: string | undefined
): string | undefined {
  if (!endpoint) {
    return undefined;
  }
  const withoutQuery = endpoint.split("?")[0];
  if (!withoutQuery) {
    return undefined;
  }
  const pathname = toPathname(withoutQuery);
  const normalized = pathname
    .split("/")
    .map((segment) => (isIdSegment(segment) ? "{id}" : segment))
    .join("/");
  return normalized;
}

function isIdSegment(segment: string): boolean {
  if (!segment) {
    return false;
  }
  return isUuid(segment) || /^\d+$/.test(segment);
}

function toPathname(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    try {
      return new URL(endpoint).pathname;
    } catch {
      return endpoint;
    }
  }
  return endpoint;
}
