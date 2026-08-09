import { CLIENT_API_ERROR_CODE } from "@/core/api/client/constant";

import { isRenderBoundary } from "./is-render-boundary";
import { normalizeReportEndpoint } from "./normalize-report-endpoint";
import type {
  ReportAppErrorContext,
  ReportedAppError,
} from "./report-app-error.types";

// Sentry 이슈 name
// 원본 error.name은 유지하고 복제본에만 씀
export function getReportAppErrorName(
  ctx: ReportAppErrorContext,
  classified: ReportedAppError
): string {
  if (isRenderBoundary(ctx.boundary)) {
    return `[render] ${formatRenderLocation(ctx)}`;
  }
  const path = normalizeReportEndpoint(ctx.endpoint);
  const method = (ctx.method ?? "GET").toUpperCase();
  if (isSocketEndpoint(ctx)) {
    return `[socket] ${path ?? ctx.endpoint ?? "unknown"}`;
  }
  if (classified.errorKind === "mapper") {
    return `[mapper] ${path ?? ctx.endpoint ?? "unknown"}`;
  }
  if (classified.errorKind === "contract") {
    return `[contract] ${method} ${path ?? "unknown"}`;
  }
  if (classified.extras.api_code === CLIENT_API_ERROR_CODE.CLIENT_TIMEOUT) {
    return `[timeout] ${method} ${path ?? "unknown"}`;
  }
  const status = classified.extras.http_status;
  if (typeof status === "number") {
    return `[${status}] ${method} ${path ?? "unknown"}`;
  }
  return `[${classified.errorKind}] ${ctx.boundary}`;
}

function formatRenderLocation(ctx: ReportAppErrorContext): string {
  return [ctx.boundary, ctx.feature, ctx.component]
    .filter((part): part is string => Boolean(part))
    .join(":");
}

function isSocketEndpoint(ctx: ReportAppErrorContext): boolean {
  return (
    ctx.feature === "chat" ||
    ctx.feature === "lightning" ||
    Boolean(ctx.endpoint?.startsWith("/sub/"))
  );
}
