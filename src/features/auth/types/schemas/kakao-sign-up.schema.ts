import { z } from "zod";

import {
  createDynamicPersonalSchema,
  personalSchema,
} from "./sign-up-personal.schema";

export { personalSchema };

export { termsAgreementSchema } from "./terms.schema";

export async function createPersonalSchema() {
  return createDynamicPersonalSchema();
}

/** 카카오 가입 최종 제출: 개인정보만(Zod 검증) — 약관은 별도 단계 스키마 */
export const fullSignUpSchema = personalSchema;

export type PersonalFormData = z.infer<typeof personalSchema>;
export type IFullSignUpFormData = z.infer<typeof fullSignUpSchema>;
export type { TermsStepFormData } from "./terms.schema";

export const stepValidationFields = {
  개인정보입력: ["name", "tellNumber", "inviteCode"] as const,
} as const;
