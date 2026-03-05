import { ClubInfo } from "@/features/club";

import type { requestSignUp } from "../api/client";
import { IEmailSignUpFormData } from "../types/schemas";

type SignUpPayload = Parameters<typeof requestSignUp>[0];

/**
 * 이메일 회원가입 폼 데이터를 API 요청 형식으로 변환
 */
export const transformSignUpData = (
  _clubList: ClubInfo[],
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
  return {
    username: email,
    password: password,
    name: name,
    clubName: nickname && nickname.trim().length > 0 ? nickname : null,
    clubId: club === undefined || club === null ? null : club,
    phoneNumber: tellNumber.replace(/-/g, ""),
    clubAge: parseInt(clubAge),
    invitationCode: inviteCode,
  };
};
