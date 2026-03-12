import { describe, expect, it } from "vitest";

import {
  isKeyboardActivationKey,
  resolveSearchKeywordFromHistoryEntry,
} from "./find-friend-panel-ui";

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
          profileImage: {
            fullFilePath: "/a",
            originalFilename: "a",
          },
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
