import { describe, expect, it } from "vitest";

import { parsePageRouteLocation } from "./parse-page-route-location";

describe("parsePageRouteLocation", () => {
  it("app 아래 라우트 그룹과 폴더를 읽는다", () => {
    expect(
      parsePageRouteLocation(
        "file:///Users/app/web/src/app/(main)/chats/r/[roomId]/_ChatRoomBoundary.tsx"
      )
    ).toEqual({
      route: "(main)/chats/r/[roomId]",
    });
  });

  it("같은 폴더의 layout도 같은 경로다", () => {
    expect(
      parsePageRouteLocation(
        "file:///src/app/(main)/chats/r/[roomId]/layout.tsx?v=1"
      )
    ).toEqual({
      route: "(main)/chats/r/[roomId]",
    });
  });

  it("마이페이지 클라 파일은 my-page 경로다", () => {
    expect(
      parsePageRouteLocation(
        "file:///src/app/(main)/my-page/_MyPage.tsx"
      )
    ).toEqual({
      route: "(main)/my-page",
    });
  });

  it("/app/가 없으면 unknown이다", () => {
    expect(parsePageRouteLocation("file:///chunks/123.js")).toEqual({
      route: "unknown",
    });
  });
});
