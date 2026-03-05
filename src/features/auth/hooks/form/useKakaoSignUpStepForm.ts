"use client";

import { useMemo } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  buildPersonalSchema,
  type IKakaoSignUpFormData,
  termsAgreementSchema,
} from "../../types/schemas";

import { useClubList } from "@/features/club/queries";

type KakaoSignUpForm = IKakaoSignUpFormData & {
  usingTermAgree: boolean;
  personalInfoAgree: boolean;
};

const initialKakaoSignUpData: IKakaoSignUpFormData = {
  name: "",
  nickname: "",
  club: undefined,
  clubAge: "",
  tellNumber: "",
  inviteCode: "",
};

export function useKakaoSignUpStepForm() {
  const { data: clubList } = useClubList();

  /**
   * `safeExtend(schema.shape)`는 base 객체 구조만 가져오고 refine을 잃는다.
   * 약관 동의·닉네임/소속패 refine을 모두 보존하기 위해 `z.intersection`으로 합성한다.
   */
  const fullSignUpSchema = useMemo(() => {
    const clubIds = clubList.map((club) => club.clubId);
    return z.intersection(termsAgreementSchema, buildPersonalSchema(clubIds));
  }, [clubList]);

  return useForm<KakaoSignUpForm>({
    resolver: zodResolver(fullSignUpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      ...initialKakaoSignUpData,
      usingTermAgree: false,
      personalInfoAgree: false,
    },
  });
}
