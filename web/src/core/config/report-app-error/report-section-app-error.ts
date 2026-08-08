import { parseSectionReportLocation } from "./parse-section-report-location";
import { reportAppError } from "./report-app-error";

// 호출 파일의 import.meta.url만 받음
// EB는 섹션 컴포넌트 폴더 안에 둠
export function reportSectionAppError(
  error: unknown,
  moduleUrl: string
): void {
  const location = parseSectionReportLocation(moduleUrl);
  reportAppError(error, {
    boundary: "section",
    feature: location.feature,
    component: location.component,
  });
}
