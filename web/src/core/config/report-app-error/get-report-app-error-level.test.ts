import { describe, expect, it } from "vitest";

import { getReportAppErrorLevel } from "./get-report-app-error-level";
import type { ReportedAppError } from "./report-app-error.types";

const reportedHttp: ReportedAppError = {
  action: "report",
  errorKind: "http",
  extras: {},
};

describe("getReportAppErrorLevel", () => {
  it("페이지, 섹션, 세그먼트, 전역 경계는 fatal이다", () => {
    expect(
      getReportAppErrorLevel({ boundary: "page" }, reportedHttp)
    ).toBe("fatal");
    expect(
      getReportAppErrorLevel({ boundary: "section" }, reportedHttp)
    ).toBe("fatal");
    expect(
      getReportAppErrorLevel({ boundary: "segment" }, reportedHttp)
    ).toBe("fatal");
    expect(
      getReportAppErrorLevel({ boundary: "global" }, reportedHttp)
    ).toBe("fatal");
  });

  it("크리티컬 플로우는 API여도 fatal이다", () => {
    expect(
      getReportAppErrorLevel(
        { boundary: "api", endpoint: "/api/auth/sign-up", method: "POST" },
        { ...reportedHttp, criticalFlow: "signup" }
      )
    ).toBe("fatal");
  });

  it("홍보 발행 크리티컬도 fatal이다", () => {
    expect(
      getReportAppErrorLevel(
        { boundary: "api", endpoint: "/api/promotions/create", method: "POST" },
        { ...reportedHttp, criticalFlow: "promotion_publish" }
      )
    ).toBe("fatal");
  });

  it("그 외 리포트는 error이다", () => {
    expect(
      getReportAppErrorLevel(
        { boundary: "api", endpoint: "/api/posts", method: "GET" },
        reportedHttp
      )
    ).toBe("error");
    expect(
      getReportAppErrorLevel({ boundary: "route" }, reportedHttp)
    ).toBe("error");
    expect(
      getReportAppErrorLevel({ boundary: "rsc" }, reportedHttp)
    ).toBe("error");
  });
});
