import { clientApiRequest } from "@/core/api/client";

import { createPromotionResponseSchema } from "./dto.schema";

export async function requestCreatePromotion(): Promise<number> {
  const { formId } = await clientApiRequest({
    url: "/api/promotions/create",
    method: "POST",
    responseSchema: createPromotionResponseSchema,
  });
  return formId;
}
