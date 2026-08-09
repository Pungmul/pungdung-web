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

  it("클라 타임아웃은 timeout으로 묶는다", () => {
    expect(
      getReportAppErrorFingerprint(
        {
          boundary: "api",
          endpoint: "/api/chats/12/text",
          method: "POST",
        },
        {
          action: "report",
          errorKind: "http",
          extras: { api_code: "CLIENT_TIMEOUT" },
        }
      )
    ).toEqual(["failure", "timeout", "POST", "/api/chats/{id}/text"]);
  });

  it("페이지 렌더는 경계와 파일 라우트로 묶는다", () => {
    expect(
      getReportAppErrorFingerprint(
        {
          boundary: "page",
          feature: "(main)/my-page/change-password",
        },
        { action: "report", errorKind: "unknown", extras: {} }
      )
    ).toEqual([
      "failure",
      "render",
      "page",
      "(main)/my-page/change-password",
      "none",
    ]);
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
