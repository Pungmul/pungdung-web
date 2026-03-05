import type { ClubInfo } from "@/features/club";
import { describe, expect, it } from "vitest";

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
        club: 42,
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
        club: 42,
      });
      expect(result.clubName).toBeNull();
    });

    it("null club이면 clubId는 null", () => {
      const result = transformSignUpData(clubList, {
        ...baseForm,
        club: null,
      });
      expect(result.clubId).toBeNull();
    });

    it("returns null clubId when club is undefined", () => {
      const result = transformSignUpData(clubList, {
        ...baseForm,
        club: undefined,
      });
      expect(result.clubId).toBeNull();
    });
  });
});
