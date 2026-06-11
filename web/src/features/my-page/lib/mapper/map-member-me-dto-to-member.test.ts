import { describe, expect, it } from "vitest";

import { CLUB_NAMES } from "@/features/club";
import type { MemberMeDto } from "@/features/my-page/api/client/dto.schema";

import { mapMemberMeDtoToMember } from "./map-member-me-dto-to-member";

function buildMemberMeDto(overrides: Partial<MemberMeDto> = {}): MemberMeDto {
  return {
    name: "홍길동",
    phoneNumber: "01012345678",
    email: "hong@example.com",
    username: "hong",
    profile: {
      id: 1,
      originalFilename: "profile.jpg",
      convertedFileName: "profile.webp",
      fullFilePath: "https://example.com/profile.webp",
      fileType: "image/webp",
      fileSize: 12_345,
      createdAt: "2026-05-17T00:00:00.000Z",
    },
    ...overrides,
  };
}

describe("mapMemberMeDtoToMember", () => {
  it("optional 필드가 없으면 결과 Member 에 키를 추가하지 않는다", () => {
    const result = mapMemberMeDtoToMember(buildMemberMeDto());

    expect(result).not.toHaveProperty("loginId");
    expect(result).not.toHaveProperty("birth");
    expect(result).not.toHaveProperty("clubAge");
    expect(result).not.toHaveProperty("groupName");
    expect(result).not.toHaveProperty("clubName");
    expect(result).not.toHaveProperty("area");
  });

  it("loginId, birth, clubAge 값이 있으면 포함한다", () => {
    const result = mapMemberMeDtoToMember(
      buildMemberMeDto({
        loginId: "test-login-id",
        birth: "1997-10-24",
        clubAge: 18,
      }),
    );

    expect(result.loginId).toBe("test-login-id");
    expect(result.birth).toBe("1997-10-24");
    expect(result.clubAge).toBe(18);
  });

  it("groupName 이 있으면 그대로 매핑한다", () => {
    const groupName = CLUB_NAMES[0];
    const result = mapMemberMeDtoToMember(buildMemberMeDto({ groupName }));

    expect(result.groupName).toBe(groupName);
  });

  it("clubName 이 빈 문자열이면 Member 에서 생략한다", () => {
    const result = mapMemberMeDtoToMember(buildMemberMeDto({ clubName: "" }));

    expect(result).not.toHaveProperty("clubName");
  });

  it("clubName 과 area 가 비어있지 않으면 둘 다 포함한다", () => {
    const result = mapMemberMeDtoToMember(
      buildMemberMeDto({
        clubName: "풍덩이",
        area: "서울",
      }),
    );

    expect(result.clubName).toBe("풍덩이");
    expect(result.area).toBe("서울");
  });
});
