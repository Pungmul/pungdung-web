import type { ClubInfo } from "@/features/club";
import { NO_CLUB_VALUE } from "@/features/club";
import { describe, expect,it } from "vitest";

import { transformSignUpData } from "./sign-up.transform";
import type { IEmailSignUpFormData } from "../types/schemas";

const clubList: ClubInfo[] = [
  { clubId: 42, school: "테스트학교", groupName: "어흥" },
];

const baseForm = {
  email: "user@example.com",
  password: "secret12!",
  confirmPassword: "secret12!",
  name: "홍길동",
  nickname: "별명",
  tellNumber: "010-1234-5678",
  clubAge: "23",
  inviteCode: "INVITE",
} as unknown as IEmailSignUpFormData;

describe("sign-up.transform", () => {
  describe("transformSignUpData", () => {
    it("maps fields and strips phone hyphens", () => {
      const result = transformSignUpData(clubList, {
        ...baseForm,
        club: "어흥",
      });
      expect(result).toEqual({
        username: "user@example.com",
        password: "secret12!",
        name: "홍길동",
        clubName: "별명",
        clubId: 42,
        phoneNumber: "01012345678",
        clubAge: 23,
        invitationCode: "INVITE",
      });
    });

    it("uses empty clubName when nickname missing", () => {
      const result = transformSignUpData(clubList, {
        ...baseForm,
        nickname: undefined,
        club: "어흥",
      });
      expect(result.clubName).toBe("");
    });

    it("normalizes NO_CLUB_VALUE to 없음 and null clubId", () => {
      const result = transformSignUpData(clubList, {
        ...baseForm,
        club: NO_CLUB_VALUE,
      });
      expect(result.clubId).toBeNull();
    });

    it("returns null clubId when club is empty", () => {
      const result = transformSignUpData(clubList, {
        ...baseForm,
        club: "" as unknown as IEmailSignUpFormData["club"],
      });
      expect(result.clubId).toBeNull();
    });
  });
});
