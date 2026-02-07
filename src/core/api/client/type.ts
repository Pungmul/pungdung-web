import { z } from "zod";

export const clientApiEnvelopeSchema = z.object({
  code: z.string(),
  message: z.string(),
  response: z.unknown(),
  isSuccess: z.boolean(),
});

export type ClientApiEnvelope = z.infer<typeof clientApiEnvelopeSchema>;
