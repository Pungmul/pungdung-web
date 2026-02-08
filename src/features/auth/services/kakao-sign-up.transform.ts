import {
  ClubInfo,
  ClubName,
  mapClubToClubId,
  NO_CLUB_VALUE,
} from "@/features/club";

import type { requestKakaoSignUp } from "../api/client";
import type { IKakaoSignUpFormData } from "../types/schemas";

type KakaoSignUpPayload = Parameters<typeof requestKakaoSignUp>[0];

/**
 * 카카오 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
export const transformKakaoSignUpData = (
  clubList: ClubInfo[],
  formData: IKakaoSignUpFormData
): KakaoSignUpPayload => {
  const { name, nickname, club, tellNumber, clubAge, inviteCode } = formData;
  const normalizedClub = club === NO_CLUB_VALUE ? "없음" : club;

  return {
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
