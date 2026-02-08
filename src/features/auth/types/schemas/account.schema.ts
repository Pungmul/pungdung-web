import { z } from "zod";

import { AUTH_VALIDATION } from "../../constants";

export const accountSchema = z
  .object({
    email: z
      .email({ message: AUTH_VALIDATION.EMAIL.INVALID_FORMAT })
      .min(1, AUTH_VALIDATION.EMAIL.REQUIRED),
    password: z
      .string()
      .min(8, AUTH_VALIDATION.PASSWORD.LENGTH_8_TO_12)
      .max(12, AUTH_VALIDATION.PASSWORD.LENGTH_8_TO_12)
      .regex(/[A-Za-z\d!@#$%^&*]{8,12}$/, {
        message: AUTH_VALIDATION.PASSWORD.ALLOWED_SPECIAL_CHARS,
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AUTH_VALIDATION.PASSWORD.MISMATCH,
    path: ["confirmPassword"],
  });

export type AccountFormData = z.infer<typeof accountSchema>;
