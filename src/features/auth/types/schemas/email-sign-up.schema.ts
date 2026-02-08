import { z } from "zod";

import { accountSchema } from "./account.schema";
import {
  createDynamicPersonalSchema,
  personalSchema,
} from "./sign-up-personal.schema";

export { accountSchema };

export { personalSchema };

export async function createPersonalSchema() {
  return createDynamicPersonalSchema();
}

/** 이메일 가입: 계정 + 개인정보 */
export const fullSignUpSchema = accountSchema.safeExtend(personalSchema.shape);

export type { AccountFormData } from "./account.schema";
export type PersonalFormData = z.infer<typeof personalSchema>;
export type FullSignUpFormData = z.infer<typeof fullSignUpSchema>;

export const stepValidationFields = {
  계정정보입력: ["email", "password", "confirmPassword"] as const,
  개인정보입력: [
    "name",
    "tellNumber",
    "inviteCode",
    "clubAge",
    "club",
  ] as const,
} as const;
