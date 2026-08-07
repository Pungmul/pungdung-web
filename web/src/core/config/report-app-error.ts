import { captureReportedAppError } from "./capture-reported-app-error";
import { classifyAppError } from "./classify-app-error";
import type { ReportAppErrorContext } from "./report-app-error.types";

export { isSectionAuthError } from "./is-section-auth-error";
export type {
  ReportAppErrorBoundary,
  ReportAppErrorContext,
} from "./report-app-error.types";
export {
  createSocketBrokerError,
  createSocketContractError,
  isSocketReconnectReason,
} from "./socket-app-error";

const reportedErrors = new WeakSet<object>();

export function reportAppError(
  error: unknown,
  ctx: ReportAppErrorContext
): void {
  const classified = classifyAppError(error, ctx);
  if (classified.action === "drop") {
    return;
  }
  if (typeof error === "object" && error !== null) {
    if (reportedErrors.has(error)) {
      return;
    }
    reportedErrors.add(error);
  }
  captureReportedAppError(error, ctx, classified);
}
