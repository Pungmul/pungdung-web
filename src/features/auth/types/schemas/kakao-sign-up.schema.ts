import {
  buildPersonalSchema,
  createDynamicPersonalSchema,
  type PersonalFormData,
} from "./sign-up-personal.schema";

export { buildPersonalSchema, createDynamicPersonalSchema };

export type { PersonalFormData };

export { termsAgreementSchema } from "./terms.schema";

export async function createPersonalSchema() {
  return createDynamicPersonalSchema();
}

export type IFullSignUpFormData = PersonalFormData;

export const stepValidationFields = {
  개인정보입력: ["name", "tellNumber", "inviteCode"] as const,
} as const;
