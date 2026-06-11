import { describe, expect, it } from "vitest";

import type { User } from "@/features/user";

import { buildDisplayFriendSubtitle } from "./build-display-friend-subtitle";

const baseUser = (over: Partial<User> = {}): User => ({
  userId: 1,
  username: "u@example.com",
  name: "이름",
  profileImage: {
    id: 1,
    originalFilename: "a.jpg",
    convertedFileName: "a.webp",
    fullFilePath: "https://example.com/a.webp",
    fileType: "image/webp",
    fileSize: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  ...over,
});

describe("buildDisplayFriendSubtitle", () => {
  it("club·group 둘 다 있으면 둘을 이어 붙인다", () => {
    expect(
      buildDisplayFriendSubtitle(
        baseUser({ clubName: "A", groupName: "B" })
      )
    ).toBe("A · B");
  });

  it("club 만 있으면 club 만 반환한다", () => {
    expect(buildDisplayFriendSubtitle(baseUser({ clubName: "동아리" }))).toBe(
      "동아리"
    );
  });

  it("group 만 있으면 group 만 반환한다", () => {
    expect(buildDisplayFriendSubtitle(baseUser({ groupName: "모임" }))).toBe(
      "모임"
    );
  });

  it("둘 다 없으면 null", () => {
    expect(buildDisplayFriendSubtitle(baseUser())).toBeNull();
  });
});
