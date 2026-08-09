import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { isRenderBoundary } from "./is-render-boundary";
import type {
  ReportAppErrorContext,
  ReportedAppError,
} from "./report-app-error.types";

export type ReportAppErrorLevel = "fatal" | "error" | "warning";

// 화면 미렌더와 크리티컬 플로우는 fatal
// CLIENT_TIMEOUT은 warning
// 그 외 리포트는 error
export function getReportAppErrorLevel(
  ctx: ReportAppErrorContext,
  classified: ReportedAppError
): ReportAppErrorLevel {
  if (isRenderBoundary(ctx.boundary)) {
    return "fatal";
  }
  if (classified.criticalFlow !== undefined) {
    return "fatal";
  }
  if (classified.extras.api_code === CLIENT_API_ERROR_CODE.CLIENT_TIMEOUT) {
    return "warning";
  }
  return "error";
}
