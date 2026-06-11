import { z } from "zod";

export const refreshAuthTokenResponseSchema = z.object({
  accessToken: z.string(),
  expiresIn: z.number(),
  refreshToken: z.string(),
  refreshTokenExpiresIn: z.number(),
});

export type RefreshAuthTokenResponse = z.infer<
  typeof refreshAuthTokenResponseSchema
>;
