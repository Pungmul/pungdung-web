import { describe, expect, it } from "vitest";

import type { User } from "@/features/user";

import {
  isKeyboardActivationKey,
  resolveSearchKeywordFromHistoryEntry,
} from "./find-friend-panel-ui";

const mockProfileImage = (): User["profileImage"] => ({
  id: 1,
  originalFilename: "a.png",
  convertedFileName: "a.webp",
  fullFilePath: "/a",
  fileType: "image/png",
  fileSize: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("resolveSearchKeywordFromHistoryEntry", () => {
  it("keyword 타입은 keyword 필드", () => {
    expect(
      resolveSearchKeywordFromHistoryEntry({
        id: "keyword:x",
        type: "keyword",
        keyword: "hello",
      })
    ).toBe("hello");
  });

  it("user 타입은 유저 이름", () => {
    expect(
      resolveSearchKeywordFromHistoryEntry({
        id: "user:1",
        type: "user",
        user: {
          userId: 1,
          username: "kim",
          name: "Kim",
          profileImage: mockProfileImage(),
          clubName: null,
          groupName: null,
        },
      })
    ).toBe("Kim");
  });
});

describe("isKeyboardActivationKey", () => {
  it("Enter·Space만 활성", () => {
    expect(isKeyboardActivationKey("Enter")).toBe(true);
    expect(isKeyboardActivationKey(" ")).toBe(true);
    expect(isKeyboardActivationKey("Escape")).toBe(false);
  });
});
