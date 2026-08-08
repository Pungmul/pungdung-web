import { ClientApiError } from "@/core/api/client/client-api-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

const MAX_QUERY_RETRIES = 3;

// React Query가 실패한 queryFn을 한 번 더 실행할지
// true면 같은 요청을 재시도
// 토큰 갱신은 여기 없음
// Route Handler fetchWithRefresh가 요청 한 번 안에서 처리
export function shouldRetryQuery(
  failureCount: number,
  error: unknown
): boolean {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return false;
  }
  if (failureCount >= MAX_QUERY_RETRIES) {
    return false;
  }
  if (isAuthError(error)) {
    return false;
  }
  if (error instanceof ClientApiError) {
    // 브라우저 네트워크 단절
    // 일시적이면 재시도
    if (error.code === CLIENT_API_ERROR_CODE.NETWORK_ERROR) {
      return true;
    }
    // 4xx, 응답 형식 오류(status 200), 잘못된 요청 바디(status 0)
    // 같은 요청을 반복해도 결과가 같음
    if (error.status < 500) {
      return false;
    }
  }
  // 5xx, 매퍼, 그 외 throw
  // 일시 장애로 보고 재시도
  return true;
}

function isAuthError(error: unknown): boolean {
  return error instanceof Error && error.name === "AuthError";
}
