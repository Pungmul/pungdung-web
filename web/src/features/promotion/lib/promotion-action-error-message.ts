import { CLIENT_API_ERROR_CODE, ClientApiError } from "@/core/api/client";

// 클라이언트 요청/응답 형식 오류는 사용자에게 보일 문구가 아님
const INTERNAL_ERROR_CODES: ReadonlySet<string> = new Set([
  CLIENT_API_ERROR_CODE.INVALID_REQUEST_BODY,
  CLIENT_API_ERROR_CODE.INVALID_RESPONSE,
  CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA,
]);

// 서버 또는 네트워크 계층이 준 사용자용 사유
// 보여줄 사유가 없으면 null
export function getPromotionActionErrorReason(error: unknown): string | null {
  if (!(error instanceof ClientApiError)) return null;
  if (INTERNAL_ERROR_CODES.has(error.code)) return null;
  return error.message || null;
}

export function formatPromotionActionError(
  title: string,
  error: unknown
): string {
  const reason = getPromotionActionErrorReason(error);
  return reason ? `${title} ${reason}` : title;
}
