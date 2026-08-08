import { describe, expect, it } from "vitest";

import { getReportAppErrorName } from "./get-report-app-error-name";
import type { ReportedAppError } from "./report-app-error.types";

const http: ReportedAppError = {
  action: "report",
  errorKind: "http",
  extras: { http_status: 502 },
};

describe("getReportAppErrorName", () => {
  it("HTTP는 상태와 정규화 경로를 넣는다", () => {
    expect(
      getReportAppErrorName(
        { boundary: "api", endpoint: "/api/posts/12?x=1", method: "GET" },
        http
      )
    ).toBe("[502] GET /api/posts/{id}");
  });

  it("페이지 렌더는 경계와 파일 라우트를 넣는다", () => {
    expect(
      getReportAppErrorName(
        {
          boundary: "page",
          feature: "(main)/chats/r/[roomId]",
        },
        { action: "report", errorKind: "unknown", extras: {} }
      )
    ).toBe("[render] page:(main)/chats/r/[roomId]");
  });

  it("섹션 렌더는 경계, feature, 컴포넌트를 넣는다", () => {
    expect(
      getReportAppErrorName(
        {
          boundary: "section",
          feature: "home",
          component: "HomeHotPostList",
        },
        { action: "report", errorKind: "unknown", extras: {} }
      )
    ).toBe("[render] section:home:HomeHotPostList");
  });

  it("소켓은 feature 태그용 경로만 name에 넣는다", () => {
    expect(
      getReportAppErrorName(
        {
          boundary: "api",
          feature: "chat",
          endpoint: "/sub/chat/message/9",
        },
        { action: "report", errorKind: "contract", extras: {} }
      )
    ).toBe("[socket] /sub/chat/message/{id}");
  });
});
