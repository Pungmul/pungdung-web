import { describe, expect, it } from "vitest";

import type { z } from "zod";

import { userDtoSchema } from "../../api/client/dto.schema";

import { mapUserDto } from "./map-user-dto";

type UserDtoParsed = z.infer<typeof userDtoSchema>;

const profileImage: UserDtoParsed["profileImage"] = {
  id: 1,
  originalFilename: "a.jpg",
  convertedFileName: "a.webp",
  fullFilePath: "https://example.com/a.webp",
  fileType: "image/webp",
  fileSize: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("mapUserDto", () => {
  it("clubName 이 undefined 면 도메인 User 에서 키를 생략한다", () => {
    const user = mapUserDto({
      userId: 1,
      username: "u@example.com",
      name: "이름",
      profileImage,
    });
    expect(user).not.toHaveProperty("clubName");
    expect(user.userId).toBe(1);
  });

  it("clubName 이 null 이면 null 로 유지한다", () => {
    const user = mapUserDto({
      userId: 1,
      username: "u@example.com",
      name: "이름",
      clubName: null,
      profileImage,
    });
    expect(user.clubName).toBeNull();
  });

  it("clubName 문자열을 그대로 옮긴다", () => {
    const user = mapUserDto({
      userId: 1,
      username: "u@example.com",
      name: "이름",
      clubName: "동아리",
      profileImage,
    });
    expect(user.clubName).toBe("동아리");
  });
});
