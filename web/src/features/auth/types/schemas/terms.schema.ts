import { z } from "zod";

import { AUTH_VALIDATION } from "../../constants";

/** 서비스·개인정보 약관 동의 — 두 필드 모두 true여야 통과 */
export const termsAgreementSchema = z
  .object({
    usingTermAgree: z.boolean(),
    personalInfoAgree: z.boolean(),
  })
  .refine((data) => data.usingTermAgree && data.personalInfoAgree, {
    message: AUTH_VALIDATION.TERMS.ALL_REQUIRED,
    path: ["usingTermAgree"],
  });

export type TermsStepFormData = z.infer<typeof termsAgreementSchema>;
