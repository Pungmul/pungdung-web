import { describe, expect, it } from "vitest";

import { readNavigationMessage, SERVICE_WORKER_NAVIGATE } from "./navigation-contract";

describe("서비스 워커 이동 메시지", () => {
  const origin = "https://app.test";

  it("명시한 메시지의 내부 경로만 허용한다", () => {
    expect(readNavigationMessage({ type: SERVICE_WORKER_NAVIGATE, href: "/board/d/30" }, origin))
      .toBe("/board/d/30");
    expect(readNavigationMessage({ type: "other", href: "/home" }, origin)).toBeNull();
  });

  it.each(["https://evil.test", "//evil.test", "/\\evil.test", "javascript:alert(1)", "/\nhome", null])(
    "외부 또는 잘못된 이동 값 %s는 무시한다", (href) => {
      expect(readNavigationMessage({ type: SERVICE_WORKER_NAVIGATE, href }, origin)).toBeNull();
    }
  );
});
