import { z } from "zod";

import { AUTH_VALIDATION } from "../../constants";

export const loginSchema = z.object({
  loginId: z
    .email({ message: AUTH_VALIDATION.EMAIL.INVALID_FORMAT })
    .min(1, AUTH_VALIDATION.EMAIL.REQUIRED),

  password: z
    .string()
    .min(8, AUTH_VALIDATION.PASSWORD.LENGTH_8_TO_12)
    .max(12, AUTH_VALIDATION.PASSWORD.LENGTH_8_TO_12),
});

export type LoginFormType = z.infer<typeof loginSchema>;
