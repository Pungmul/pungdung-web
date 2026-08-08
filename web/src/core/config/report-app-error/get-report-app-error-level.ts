import { isRenderBoundary } from "./is-render-boundary";
import type {
  ReportAppErrorContext,
  ReportedAppError,
} from "./report-app-error.types";

export type ReportAppErrorLevel = "fatal" | "error" | "warning";

// 화면 미렌더와 크리티컬 플로우는 fatal
// 그 외 리포트는 error
// warning은 타임아웃처럼 예상 가능 건에만. 지금은 drop이라 안 씀
export function getReportAppErrorLevel(
  ctx: ReportAppErrorContext,
  classified: ReportedAppError
): Exclude<ReportAppErrorLevel, "warning"> {
  if (isRenderBoundary(ctx.boundary)) {
    return "fatal";
  }
  if (classified.criticalFlow !== undefined) {
    return "fatal";
  }
  return "error";
}
