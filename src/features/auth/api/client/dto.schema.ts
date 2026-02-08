import { z } from "zod";

export const loginRequestSchema = z.object({
  loginId: z.email(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.string();
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const accessTokenResponseSchema = z.object({
  accessToken: z.string(),
});
export type AccessTokenResponse = z.infer<typeof accessTokenResponseSchema>;

export const emailExistsRequestSchema = z.object({
  email: z.email(),
});
export type EmailExistsRequest = z.infer<typeof emailExistsRequestSchema>;

export const emailExistsResponseSchema = z.object({
  isRegistered: z.boolean(),
});
export type EmailExistsResponse = z.infer<typeof emailExistsResponseSchema>;

export const signUpRequestSchema = z.object({
  username: z.email(),
  password: z.string(),
  name: z.string(),
  clubName: z.string().optional(),
  clubId: z.number().nullable().optional(),
  clubAge: z.number(),
  phoneNumber: z.string(),
  invitationCode: z.string(),
});
export type SignUpRequestForm = z.infer<typeof signUpRequestSchema>;

export const kakaoSignUpRequestSchema = z.object({
  name: z.string(),
  clubName: z.string().optional(),
  clubId: z.number().nullable().optional(),
  phoneNumber: z.string(),
  clubAge: z.number(),
  invitationCode: z.string(),
});
export type KakaoSignUpRequestForm = z.infer<typeof kakaoSignUpRequestSchema>;

export const resetPasswordRequestSchema = z.object({
  password: z.string(),
  token: z.string(),
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export const resetPasswordResponseSchema = z.object({
  username: z.string(),
  name: z.string(),
  clubName: z.string(),
  groupName: z.string(),
  phoneNumber: z.string(),
  clubAge: z.number(),
  email: z.email(),
});
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;

export const passwordResetEmailRequestSchema = z.object({
  email: z.email(),
});
export type PasswordResetEmailRequest = z.infer<
  typeof passwordResetEmailRequestSchema
>;

export const voidResponseSchema = z.unknown().transform(() => undefined);
