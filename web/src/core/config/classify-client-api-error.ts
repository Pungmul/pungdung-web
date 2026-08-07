import { ClientApiError } from "@/core/api/client/client-api-error";
import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { getCriticalFlow } from "./classify-critical-flow";
import type {
  ClassifiedAppError,
  ReportAppErrorContext,
} from "./report-app-error.types";
import { buildClientApiExtras } from "./report-app-error-extras";
import { ROUTE_REPORTED_CODES } from "./route-failure-code";

// ClientApiError 허용/거부
// NETWORK_ERROR, status 0, 401/403, 일반 4xx는 drop
// INVALID_REQUEST_BODY는 status 0이어도 리포트
// Route Handler가 이미 리포트한 UPSTREAM_*/PROXY_FAILURE는
// route 경계가 아니면 다시 안 보냄
export function classifyClientApiError(
  error: ClientApiError,
  ctx: ReportAppErrorContext
): ClassifiedAppError {
  if (error.code === CLIENT_API_ERROR_CODE.NETWORK_ERROR) {
    return { action: "drop" };
  }
  if (isAlreadyReportedByRouteHandler(ctx, error.code)) {
    return { action: "drop" };
  }
  if (error.code === CLIENT_API_ERROR_CODE.INVALID_REQUEST_BODY) {
    return {
      action: "report",
      errorKind: "http",
      extras: buildClientApiExtras(error),
    };
  }
  if (
    error.code === CLIENT_API_ERROR_CODE.INVALID_RESPONSE ||
    error.code === CLIENT_API_ERROR_CODE.INVALID_RESPONSE_SCHEMA
  ) {
    return {
      action: "report",
      errorKind: "contract",
      extras: buildClientApiExtras(error),
    };
  }
  if (error.status === 0 || error.status === 401 || error.status === 403) {
    return { action: "drop" };
  }
  if (error.status >= 500 && error.status <= 599) {
    return {
      action: "report",
      errorKind: "http",
      extras: buildClientApiExtras(error),
    };
  }
  if (error.status >= 400 && error.status <= 499) {
    const criticalFlow = getCriticalFlow(ctx);
    if (!criticalFlow) {
      return { action: "drop" };
    }
    return {
      action: "report",
      errorKind: "http",
      criticalFlow,
      extras: buildClientApiExtras(error),
    };
  }
  return { action: "drop" };
}

// Route Handler가 이미 보낸 PROXY/UPSTREAM 코드
// 클라 훅에서 같은 envelope를 다시 보내지 않음
function isAlreadyReportedByRouteHandler(
  ctx: ReportAppErrorContext,
  code: string
): boolean {
  return ctx.boundary !== "route" && ROUTE_REPORTED_CODES.has(code);
}
