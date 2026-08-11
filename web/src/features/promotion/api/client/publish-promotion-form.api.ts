import { z } from "zod";

import { clientApiRequest } from "@/core/api/client";

export async function publishPromotionForm(
  formId: number,
  expectedVersion: number
) {
  return clientApiRequest({
    url: `/api/promotions/forms/${formId}/submit`,
    method: "POST",
    body: { expectedVersion },
    responseSchema: z.unknown(),
  });
}
