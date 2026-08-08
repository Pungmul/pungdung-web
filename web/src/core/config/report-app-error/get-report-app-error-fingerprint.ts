import { normalizeReportEndpoint } from "./normalize-report-endpoint";
import type {
  ReportAppErrorContext,
  ReportedAppError,
} from "./report-app-error.types";

// 이슈 그룹
// API는 정규화 경로. feature는 태그
// 렌더는 경계/feature/component
export function getReportAppErrorFingerprint(
  ctx: ReportAppErrorContext,
  classified: ReportedAppError
): string[] {
  const path = normalizeReportEndpoint(ctx.endpoint);
  if (path) {
    const method = (ctx.method ?? "GET").toUpperCase();
    return ["failure", classified.errorKind, method, path];
  }
  if (
    ctx.boundary === "section" ||
    ctx.boundary === "segment" ||
    ctx.boundary === "global"
  ) {
    return [
      "failure",
      "render",
      ctx.boundary,
      ctx.feature ?? "none",
      ctx.component ?? "none",
    ];
  }
  return ["failure", classified.errorKind, ctx.boundary];
}
