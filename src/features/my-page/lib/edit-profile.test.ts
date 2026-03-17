import { describe, expect, it } from "vitest";

import type { EditProfileFormValues } from "@/features/my-page/types";

import { transformEditProfileData } from "./edit-profile";

function buildFormValues(
  overrides: Partial<EditProfileFormValues>,
): EditProfileFormValues {
  return {
    profileImage: undefined,
    name: "",
    nickname: "",
    club: undefined,
    clubAge: "",
    tellNumber: "",
    ...overrides,
  } as EditProfileFormValues;
}

describe("transformEditProfileData", () => {
  it("빈 학번 문자열일 때 서버 학번 폴백을 쓴다", () => {
    const result = transformEditProfileData(
      buildFormValues({ clubAge: "", tellNumber: "010" }),
      { serverClubAgeFallback: 25 },
    );
    expect(result.clubAge).toBe(25);
  });

  it("전화번호 하이픈을 제거한다", () => {
    const result = transformEditProfileData(
      buildFormValues({ tellNumber: "010-1234-5678" }),
      { serverClubAgeFallback: 1 },
    );
    expect(result.phoneNumber).toBe("01012345678");
  });

  it("패명을 clubName 필드로 넘긴다", () => {
    const result = transformEditProfileData(
      buildFormValues({ nickname: "풍덩", clubAge: "22" }),
      { serverClubAgeFallback: 1 },
    );
    expect(result.clubName).toBe("풍덩");
    expect(result.clubAge).toBe(22);
  });
});
