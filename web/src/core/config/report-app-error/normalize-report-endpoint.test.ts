import { describe, expect, it } from "vitest";

import { normalizeReportEndpoint } from "./normalize-report-endpoint";

describe("normalizeReportEndpoint", () => {
  it("쿼리를 제거하고 숫자 path를 {id}로 바꾼다", () => {
    expect(normalizeReportEndpoint("/api/posts/12?q=안녕")).toBe(
      "/api/posts/{id}"
    );
  });

  it("UUID path를 {id}로 바꾼다", () => {
    expect(
      normalizeReportEndpoint(
        "/sub/chat/message/550e8400-e29b-41d4-a716-446655440000"
      )
    ).toBe("/sub/chat/message/{id}");
  });

  it("절대 URL은 pathname만 남긴다", () => {
    expect(
      normalizeReportEndpoint("https://example.com/api/posts/3")
    ).toBe("/api/posts/{id}");
  });
});
