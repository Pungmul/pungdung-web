import { describe, expect, it } from "vitest";

import { patchChatRoomLocalOverride } from "./chat-room-local-override.service";

describe("patchChatRoomLocalOverride", () => {
  it("기존 로컬 이미지 override를 유지하면서 이름 override를 갱신한다", () => {
    const result = patchChatRoomLocalOverride(
      { profileImageUrl: "data:image/png;base64,old" },
      { roomName: "로컬 방" }
    );

    expect(result).toEqual({
      roomName: "로컬 방",
      profileImageUrl: "data:image/png;base64,old",
    });
  });

  it("undefined patch는 해당 필드만 삭제한다", () => {
    const result = patchChatRoomLocalOverride(
      { roomName: "로컬 방", profileImageUrl: "data:image/png;base64,old" },
      { roomName: undefined }
    );

    expect(result).toEqual({
      profileImageUrl: "data:image/png;base64,old",
    });
  });

  it("모든 override 필드가 지워지면 undefined를 반환한다", () => {
    const result = patchChatRoomLocalOverride(
      { roomName: "로컬 방" },
      { roomName: undefined }
    );

    expect(result).toBeUndefined();
  });

  it("null profileImageUrl은 기본 이미지 삭제가 아니라 명시적 null override로 보존한다", () => {
    const result = patchChatRoomLocalOverride(undefined, {
      profileImageUrl: null,
    });

    expect(result).toEqual({ profileImageUrl: null });
  });
});
