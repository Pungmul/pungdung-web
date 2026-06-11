import { ClubInfo } from "@/features/club";

import type { requestKakaoSignUp } from "../api/client";
import type { IKakaoSignUpFormData } from "../types/schemas";

type KakaoSignUpPayload = Parameters<typeof requestKakaoSignUp>[0];

/**
 * 카카오 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
export const transformKakaoSignUpData = (
  _clubList: ClubInfo[],
  formData: IKakaoSignUpFormData
): KakaoSignUpPayload => {
  const { name, nickname, club, tellNumber, clubAge, inviteCode } = formData;
  return {
    name: name,
    clubName: nickname && nickname.trim().length > 0 ? nickname : null,
    clubId: club === undefined || club === null ? null : club,
    phoneNumber: tellNumber.replace(/-/g, ""),
    clubAge: parseInt(clubAge),
    invitationCode: inviteCode,
  };
};
