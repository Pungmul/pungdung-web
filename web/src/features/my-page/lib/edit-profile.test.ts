import { describe, expect, it } from "vitest";

import type { EditProfileFormValues } from "../types";

import { transformEditProfileData } from "./edit-profile";

function buildFormValues(
  overrides: Partial<EditProfileFormValues>
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
      {
        serverClubAgeFallback: 25,
        lockedClubNameFallback: "",
        lockedClubIdFallback: null,
        isClubNameLocked: false,
        isClubLocked: false,
      }
    );
    expect(result.clubAge).toBe(25);
  });

  it("전화번호 하이픈을 제거한다", () => {
    const result = transformEditProfileData(
      buildFormValues({ tellNumber: "010-1234-5678" }),
      {
        serverClubAgeFallback: 1,
        lockedClubNameFallback: "",
        lockedClubIdFallback: null,
        isClubNameLocked: false,
        isClubLocked: false,
      }
    );
    expect(result.phoneNumber).toBe("01012345678");
  });

  it("패명을 clubName 필드로 넘긴다", () => {
    const result = transformEditProfileData(
      buildFormValues({ nickname: "풍덩", clubAge: "22" }),
      {
        serverClubAgeFallback: 1,
        lockedClubNameFallback: "",
        lockedClubIdFallback: null,
        isClubNameLocked: false,
        isClubLocked: false,
      }
    );
    expect(result.clubName).toBe("풍덩");
    expect(result.clubAge).toBe(22);
  });

  it("패명이 공백이면 clubName을 null로 넘긴다", () => {
    const result = transformEditProfileData(
      buildFormValues({ nickname: "   ", clubAge: "22" }),
      {
        serverClubAgeFallback: 1,
        lockedClubNameFallback: "",
        lockedClubIdFallback: null,
        isClubNameLocked: false,
        isClubLocked: false,
      }
    );

    expect(result.clubName).toBeNull();
  });

  it("패명 잠금 시 폼 값 대신 서버 원본 패명을 유지한다", () => {
    const result = transformEditProfileData(
      buildFormValues({ nickname: "새패명", clubAge: "22" }),
      {
        serverClubAgeFallback: 1,
        lockedClubNameFallback: "기존패명",
        lockedClubIdFallback: null,
        isClubNameLocked: true,
        isClubLocked: false,
      }
    );

    expect(result.clubName).toBe("기존패명");
  });

  it("동아리 잠금 시 폼 값 대신 서버 원본 동아리 id를 유지한다", () => {
    const result = transformEditProfileData(
      buildFormValues({ club: 7, clubAge: "22" }),
      {
        serverClubAgeFallback: 1,
        lockedClubNameFallback: "",
        lockedClubIdFallback: 3,
        isClubNameLocked: false,
        isClubLocked: true,
      }
    );

    expect(result.clubId).toBe(3);
  });
});
