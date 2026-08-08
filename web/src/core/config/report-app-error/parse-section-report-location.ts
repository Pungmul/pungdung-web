const FEATURES_SEGMENT = "/features/";

export type SectionReportLocation = {
  feature: string;
  component: string;
};

// 섹션 EB 파일 위치에서 feature/컴포넌트 폴더를 읽음
// import.meta.url은 호출 파일에서 넘김
export function parseSectionReportLocation(
  moduleUrl: string
): SectionReportLocation {
  const path = toPosixPath(moduleUrl).split("?")[0]?.split("#")[0] ?? "";
  const afterFeatures = takeAfter(path, FEATURES_SEGMENT);
  if (!afterFeatures) {
    return { feature: "unknown", component: "unknown" };
  }
  const parts = afterFeatures.split("/").filter(Boolean);
  const parentFolder = parts.at(-2);
  const file = parts.at(-1) ?? "";
  return {
    feature: parts[0] ?? "unknown",
    component: parentFolder || stripFileExt(file) || "unknown",
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

function stripFileExt(file: string): string {
  return file.replace(/\.(tsx|ts|jsx|js)$/i, "");
}
