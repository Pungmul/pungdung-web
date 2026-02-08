import type { ClubInfo } from "@/features/club";
import { NO_CLUB_VALUE } from "@/features/club";
import { describe, expect,it } from "vitest";

import { transformKakaoSignUpData } from "./kakao-sign-up.transform";
import type { IKakaoSignUpFormData } from "../types/schemas";

const clubList: ClubInfo[] = [
  { clubId: 7, school: "테스트학교", groupName: "어흥" },
];

const baseForm = {
  name: "홍길동",
  nickname: "패명",
  tellNumber: "010-9999-8888",
  clubAge: "21",
  inviteCode: "KAKAO",
} as unknown as IKakaoSignUpFormData;

describe("kakao-sign-up.transform", () => {
  describe("transformKakaoSignUpData", () => {
    it("maps fields without email/password", () => {
      const result = transformKakaoSignUpData(clubList, {
        ...baseForm,
        club: "어흥",
      });
      expect(result).toEqual({
        name: "홍길동",
        clubName: "패명",
        clubId: 7,
        phoneNumber: "01099998888",
        clubAge: 21,
        invitationCode: "KAKAO",
      });
    });

    it("normalizes NO_CLUB_VALUE to null clubId", () => {
      const result = transformKakaoSignUpData(clubList, {
        ...baseForm,
        club: NO_CLUB_VALUE,
      });
      expect(result.clubId).toBeNull();
    });
  });
});
