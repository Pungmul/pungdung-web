import { z } from "zod";

import { AUTH_VALIDATION } from "../../constants";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, AUTH_VALIDATION.CHANGE_PASSWORD.CURRENT_REQUIRED),
    newPassword: z
      .string()
      .min(1, AUTH_VALIDATION.CHANGE_PASSWORD.NEW_REQUIRED),
    confirmPassword: z
      .string()
      .min(1, AUTH_VALIDATION.CHANGE_PASSWORD.CONFIRM_REQUIRED),
  })
  .refine(
    (data: { newPassword: string; confirmPassword: string }) =>
      data.newPassword === data.confirmPassword,
    {
      message: AUTH_VALIDATION.PASSWORD.MISMATCH,
      path: ["confirmPassword"],
    }
  );

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
