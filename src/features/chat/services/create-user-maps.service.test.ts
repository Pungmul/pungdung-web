import { describe, expect, it } from "vitest";

import type { User } from "@/features/user";

import { createUserImageMap } from "./create-user-image-map.service";
import { createUserNameMap } from "./create-user-name-map.service";

const profile = (path: string) =>
  ({
    id: 1,
    originalFilename: "a",
    convertedFileName: "a",
    fullFilePath: path,
    fileType: "jpg",
    fileSize: 1,
    createdAt: "2026-01-01",
  }) as User["profileImage"];

const user = (over: Partial<User> & Pick<User, "userId" | "username">): User => ({
  name: "이름",
  profileImage: profile("/p.png"),
  ...over,
});

describe("create-user-maps.service", () => {
  const users: User[] = [
    user({ userId: 1, username: "a", name: "가" }),
    user({ userId: 2, username: "b", name: "나" }),
  ];

  it("createUserImageMap은 fullFilePath를 넣고 없으면 빈 문자열", () => {
    const u2 = { ...users[1]!, profileImage: { ...users[1]!.profileImage, fullFilePath: "" } };
    const map = createUserImageMap([users[0]!, u2]);
    expect(map.a).toBe("/p.png");
    expect(map.b).toBe("");
  });

  it("createUserNameMap은 name이 없을 때 빈 문자열", () => {
    const map = createUserNameMap([{ ...users[0]!, name: "" }]);
    expect(map.a).toBe("");
  });
});
