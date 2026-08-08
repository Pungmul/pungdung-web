import { describe, expect, it } from "vitest";

import { getReportAppErrorFingerprint } from "./get-report-app-error-fingerprint";
import type { ReportedAppError } from "./report-app-error.types";

const http: ReportedAppError = {
  action: "report",
  errorKind: "http",
  extras: {},
};

describe("getReportAppErrorFingerprint", () => {
  it("API는 정규화 경로로 묶고 feature는 넣지 않는다", () => {
    expect(
      getReportAppErrorFingerprint(
        {
          boundary: "api",
          endpoint: "/api/posts/12?q=1",
          method: "GET",
          feature: "home",
        },
        http
      )
    ).toEqual(["failure", "http", "GET", "/api/posts/{id}"]);
  });

  it("렌더는 경계와 feature, 컴포넌트로 묶는다", () => {
    expect(
      getReportAppErrorFingerprint(
        {
          boundary: "section",
          feature: "home",
          component: "HomeHotPostList",
        },
        { action: "report", errorKind: "unknown", extras: {} }
      )
    ).toEqual([
      "failure",
      "render",
      "section",
      "home",
      "HomeHotPostList",
    ]);
  });
});
