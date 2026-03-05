"use client";

import { useMemo } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  accountSchema,
  createClubFieldSchema,
  type IEmailSignUpFormData,
  personalSchema,
  termsAgreementSchema,
} from "../../types/schemas";

import { useClubList } from "@/features/club/queries";

type EmailSignUpForm = IEmailSignUpFormData & {
  usingTermAgree: boolean;
  personalInfoAgree: boolean;
};

const initialEmailSignUpData: IEmailSignUpFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  nickname: "",
  club: undefined,
  clubAge: "",
  tellNumber: "",
  inviteCode: "",
};

export function useEmailSignUpStepForm() {
  const { data: clubList } = useClubList();

  /**
   * `safeExtend(schema.shape)`는 base 객체 구조만 가져오고 refine을 잃는다.
   * 각 sub-schema의 refine(약관 동의·비밀번호 일치·닉네임/소속패)을 모두 보존하기 위해
   * `z.intersection`으로 합성한다.
   */
  const fullSignUpSchema = useMemo(() => {
    const clubSchema = createClubFieldSchema(
      clubList.map((club) => club.clubId)
    );

    const dynamicPersonalSchema = personalSchema.safeExtend({
      club: clubSchema,
    });

    return z.intersection(
      termsAgreementSchema,
      z.intersection(accountSchema, dynamicPersonalSchema)
    );
  }, [clubList]);

  return useForm<EmailSignUpForm>({
    resolver: zodResolver(fullSignUpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      ...initialEmailSignUpData,
      usingTermAgree: false,
      personalInfoAgree: false,
    },
  });
}
