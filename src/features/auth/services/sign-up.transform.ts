import {
  ClubInfo,
  ClubName,
  mapClubToClubId,
  NO_CLUB_VALUE,
} from "@/features/club";

import type { requestSignUp } from "../api/client";
import { IEmailSignUpFormData } from "../types/schemas";

type SignUpPayload = Parameters<typeof requestSignUp>[0];

/**
 * 이메일 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
export const transformSignUpData = (
  clubList: ClubInfo[],
  formData: IEmailSignUpFormData
): SignUpPayload => {
  const {
    email,
    password,
    name,
    nickname,
    club,
    tellNumber,
    clubAge,
    inviteCode,
  } = formData;
  const normalizedClub = club === NO_CLUB_VALUE ? "없음" : club;

  return {
    username: email,
    password: password,
    name: name,
    clubName: nickname || "",
    clubId: normalizedClub
      ? mapClubToClubId(clubList, normalizedClub as ClubName)
      : null,
    phoneNumber: tellNumber.replace(/-/g, ""),
    clubAge: parseInt(clubAge),
    invitationCode: inviteCode,
  };
};
