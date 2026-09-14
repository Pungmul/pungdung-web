import { clientApiRequest } from "@/core/api/client";

import { closePromotionFormResponseSchema } from "./dto.schema";

export function closePromotionForm(formId: number) {
  return clientApiRequest({
    url: `/api/promotions/forms/${formId}/close`,
    method: "PATCH",
    responseSchema: closePromotionFormResponseSchema,
  });
}
