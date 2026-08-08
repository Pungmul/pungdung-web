import { parsePageRouteLocation } from "./parse-page-route-location";
import { reportAppError } from "./report-app-error";

// 호출 파일의 import.meta.url만 받음
// EB는 app 페이지/레이아웃 폴더에 둠
export function reportPageRouteAppError(
  error: unknown,
  moduleUrl: string
): void {
  const location = parsePageRouteLocation(moduleUrl);
  reportAppError(error, {
    boundary: "page",
    feature: location.route,
  });
}
