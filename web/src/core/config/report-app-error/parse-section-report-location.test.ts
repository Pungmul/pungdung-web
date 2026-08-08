import { describe, expect, it } from "vitest";

import { parseSectionReportLocation } from "./parse-section-report-location";

describe("parseSectionReportLocation", () => {
  it("features 아래 폴더를 feature, 부모 폴더를 component로 읽는다", () => {
    expect(
      parseSectionReportLocation(
        "file:///Users/app/web/src/features/home/components/section/HomeHotPostList/HomeHotPostListErrorBoundary.tsx"
      )
    ).toEqual({
      feature: "home",
      component: "HomeHotPostList",
    });
  });

  it("쿼리가 있어도 폴더 이름을 읽는다", () => {
    expect(
      parseSectionReportLocation(
        "file:///src/features/chat/components/section/chat-room-list/ChatRoomPanel/ChatRoomPanelErrorBoundary.tsx?v=1"
      )
    ).toEqual({
      feature: "chat",
      component: "ChatRoomPanel",
    });
  });

  it("/features/가 없으면 unknown이다", () => {
    expect(
      parseSectionReportLocation("file:///chunks/123.js")
    ).toEqual({
      feature: "unknown",
      component: "unknown",
    });
  });
});
