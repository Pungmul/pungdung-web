import { z } from "zod";

import { AUTH_VALIDATION } from "../../constants";

export const emailCheckSchema = z.object({
  email: z
    .email({ message: AUTH_VALIDATION.EMAIL.INVALID_FORMAT })
    .min(1, AUTH_VALIDATION.EMAIL.REQUIRED),
});

export type EmailCheckFormData = z.infer<typeof emailCheckSchema>;

export const resetPasswordSchema = z
  .object({
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

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
