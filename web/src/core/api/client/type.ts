import { z } from "zod";

import { normalizeEnvelopeInput } from "../normalize-envelope-input";

export const clientApiEnvelopeSchema = z.preprocess(
  normalizeEnvelopeInput,
  z.object({
    code: z.string(),
    message: z.string(),
    response: z.unknown(),
    isSuccess: z.boolean(),
  })
);

export type ClientApiEnvelope = z.infer<typeof clientApiEnvelopeSchema>;
