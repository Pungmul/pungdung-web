import { describe, expect, it } from "vitest";

import type { ProfileImage } from "../types/profile-image.types";
import type { User } from "../types/user.types";
import { normalizeUserForProfileModal } from "./normalize-user-for-profile-modal";

function createProfileImage(id: number): ProfileImage {
  return {
    id,
    originalFilename: `origin-${id}.png`,
    convertedFileName: `converted-${id}.png`,
    fullFilePath: `/profiles/${id}.png`,
    fileType: "image/png",
    fileSize: 128,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

function createBaseUser(overrides?: Partial<User>): User {
  return {
    userId: 10,
    username: "tester",
    name: "기본 이름",
    clubName: "기본 동아리",
    groupName: "기본 그룹",
    profileImage: createProfileImage(1),
    ...overrides,
  };
}

describe("normalizeUserForProfileModal", () => {
  it("name이 비어있지 않으면 trim한 name을 우선 사용한다", () => {
    const input = createBaseUser({ name: "  표시 이름  " });

    const result = normalizeUserForProfileModal(input);

    expect(result.name).toBe("표시 이름");
  });

  it("name이 비어 있고 clubName이 있으면 clubName(trim)으로 name을 채운다", () => {
    const input = createBaseUser({
      name: "   ",
      clubName: "  프론트엔드 동아리  ",
    });

    const result = normalizeUserForProfileModal(input);

    expect(result.name).toBe("프론트엔드 동아리");
  });

  it("name과 clubName이 모두 비어 있으면 username으로 name을 채운다", () => {
    const input = createBaseUser({
      name: " ",
      clubName: "   ",
      username: "fallback-user",
    });

    const result = normalizeUserForProfileModal(input);

    expect(result.name).toBe("fallback-user");
  });

  it("profileImage가 있으면 profile보다 profileImage를 우선 사용한다", () => {
    const input = {
      ...createBaseUser({ profileImage: createProfileImage(100) }),
      profile: createProfileImage(200),
    } as User & { profile?: ProfileImage | null };

    const result = normalizeUserForProfileModal(input);

    expect(result.profileImage).toEqual(createProfileImage(100));
  });

  it("profileImage가 없으면 profile 값을 profileImage로 사용한다", () => {
    const profileFallback = createProfileImage(300);
    const input = {
      ...createBaseUser(),
      profileImage: undefined,
      profile: profileFallback,
    } as unknown as User;

    const result = normalizeUserForProfileModal(input);

    expect(result.profileImage).toEqual(profileFallback);
  });

  it("userId, username, clubName, groupName을 그대로 전달한다", () => {
    const input = createBaseUser({
      userId: 99,
      username: "carry-user",
      clubName: null,
      groupName: "운영진",
    });

    const result = normalizeUserForProfileModal(input);

    expect(result.userId).toBe(99);
    expect(result.username).toBe("carry-user");
    expect(result.clubName).toBeNull();
    expect(result.groupName).toBe("운영진");
  });
});
