const APP_SEGMENT = "/app/";

export type PageRouteReportLocation = {
  route: string;
};

// app 파일 라우트에서 그룹 포함 경로를 읽음
// import.meta.url은 호출 파일에서 넘김
export function parsePageRouteLocation(
  moduleUrl: string
): PageRouteReportLocation {
  const path = toPosixPath(moduleUrl).split("?")[0]?.split("#")[0] ?? "";
  const afterApp = takeAfter(path, APP_SEGMENT);
  if (!afterApp) {
    return { route: "unknown" };
  }
  const parts = afterApp.split("/").filter(Boolean);
  const last = parts.at(-1) ?? "";
  if (hasFileExt(last)) {
    parts.pop();
  }
  return {
    route: parts.join("/") || "unknown",
  };
}

function toPosixPath(moduleUrl: string): string {
  return moduleUrl.replace(/\\/g, "/");
}

function takeAfter(path: string, marker: string): string | undefined {
  const index = path.lastIndexOf(marker);
  if (index < 0) {
    return undefined;
  }
  return path.slice(index + marker.length);
}

function hasFileExt(file: string): boolean {
  return /\.(tsx|ts|jsx|js)$/i.test(file);
}
