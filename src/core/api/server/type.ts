import { z } from "zod";

export const upstreamEnvelopeSchema = z.object({
  code: z.string(),
  message: z.string(),
  response: z.unknown(),
  isSuccess: z.boolean(),
});

export type UpstreamEnvelope = z.infer<typeof upstreamEnvelopeSchema>;

export type ValidateUpstreamResult =
  | { ok: true; data: UpstreamEnvelope }
  | {
      ok: false;
      error: {
        status: number;
        body: {
          code: string;
          message: string;
          response: null;
          isSuccess: false;
        };
      };
    };

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}
