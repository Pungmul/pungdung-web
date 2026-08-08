import type { ReportAppErrorBoundary } from "./report-app-error.types";

export function isRenderBoundary(
  boundary: ReportAppErrorBoundary
): boolean {
  return (
    boundary === "page" ||
    boundary === "section" ||
    boundary === "segment" ||
    boundary === "global"
  );
}
