import { describe, expect, it } from "vitest";

import { buildReadSignPublishPayload } from "./build-read-sign-publish-payload.service";

describe("buildReadSignPublishPayload", () => {
  it("targetMessageId가 없으면 chatRoomUUID만 보낸다", () => {
    expect(buildReadSignPublishPayload("room-1", null)).toEqual({
      chatRoomUUID: "room-1",
    });
  });

  it("targetMessageId가 있으면 lastReadMessageId를 포함한다", () => {
    expect(buildReadSignPublishPayload("room-1", 1034)).toEqual({
      chatRoomUUID: "room-1",
      lastReadMessageId: 1034,
    });
  });
});
