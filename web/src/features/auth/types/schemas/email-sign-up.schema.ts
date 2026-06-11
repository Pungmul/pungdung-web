import { z } from "zod";

import { accountSchema } from "./account.schema";
import {
  buildPersonalSchema,
  createDynamicPersonalSchema,
  type PersonalFormData,
} from "./sign-up-personal.schema";

export { accountSchema };
export type { AccountFormData } from "./account.schema";
export type { PersonalFormData };
export { buildPersonalSchema, createDynamicPersonalSchema };

export async function createPersonalSchema() {
  return createDynamicPersonalSchema();
}

/** `clubIds`는 `clubQueries.list()` 등에서 온 API 클럽 id 목록과 동일하게 둔다. */
export function buildEmailSignUpSchema(clubIds: number[]) {
  return z.intersection(accountSchema, buildPersonalSchema(clubIds));
}

export type FullSignUpFormData = z.infer<ReturnType<typeof buildEmailSignUpSchema>>;

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
