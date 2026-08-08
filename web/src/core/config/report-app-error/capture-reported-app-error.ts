import * as Sentry from "@sentry/nextjs";

import { createSentryCaptureError } from "./create-sentry-capture-error";
import { getReportAppErrorFingerprint } from "./get-report-app-error-fingerprint";
import { getReportAppErrorLevel } from "./get-report-app-error-level";
import { getReportAppErrorName } from "./get-report-app-error-name";
import type {
  ReportAppErrorContext,
  ReportedAppError,
} from "./report-app-error.types";
import { collectDeviceExtras } from "./report-app-error-device";

export function captureReportedAppError(
  error: unknown,
  ctx: ReportAppErrorContext,
  classified: ReportedAppError
): void {
  const extras = buildCaptureExtras(ctx, classified);
  // beforeSend는 report_class=failure만 통과
  // 태그로 이슈를 거름
  Sentry.withScope((scope) => {
    scope.setLevel(getReportAppErrorLevel(ctx, classified));
    scope.setTag("report_class", "failure");
    scope.setTag("error_kind", classified.errorKind);
    scope.setTag("boundary", ctx.boundary);
    if (ctx.feature) {
      scope.setTag("feature", ctx.feature);
    }
    if (classified.criticalFlow) {
      scope.setTag("critical_flow", classified.criticalFlow);
    }
    scope.setFingerprint(getReportAppErrorFingerprint(ctx, classified));
    for (const [key, value] of Object.entries(extras)) {
      if (value !== undefined) {
        scope.setExtra(key, value);
      }
    }
    Sentry.captureException(
      createSentryCaptureError(error, getReportAppErrorName(ctx, classified))
    );
  });
}

// 이슈 extra 조립
// 분류 extra + endpoint/method/feature
// 요청/소켓 바디 없음
function buildCaptureExtras(
  ctx: ReportAppErrorContext,
  classified: ReportedAppError
): Record<string, unknown> {
  const extras: Record<string, unknown> = { ...classified.extras };
  if (ctx.endpoint) {
    extras.endpoint = ctx.endpoint;
    if (isSocketTopicEndpoint(ctx)) {
      extras.topic = ctx.endpoint;
    }
  }
  if (ctx.method) {
    extras.method = ctx.method;
  }
  if (ctx.feature) {
    extras.feature = ctx.feature;
  }
  if (shouldAttachDeviceExtras(ctx, classified)) {
    Object.assign(extras, collectDeviceExtras());
  }
  return extras;
}

function isSocketTopicEndpoint(ctx: ReportAppErrorContext): boolean {
  return (
    ctx.feature === "chat" ||
    ctx.feature === "lightning" ||
    Boolean(ctx.endpoint?.startsWith("/sub/"))
  );
}

// 가입 크리티컬 4xx와 소켓 계약 실패에만 디바이스 붙임
// 계정 PII 없음
function shouldAttachDeviceExtras(
  ctx: ReportAppErrorContext,
  classified: ReportedAppError
): boolean {
  return (
    classified.criticalFlow === "signup" ||
    (ctx.boundary === "api" &&
      (ctx.feature === "chat" || ctx.feature === "lightning"))
  );
}
