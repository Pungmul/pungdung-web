import { clientApiRequest } from "@/core/api/client";

import { deletePromotionFormResponseSchema } from "./dto.schema";

export function deletePromotionForm(formId: number) {
  return clientApiRequest({
    url: `/api/promotions/forms/${formId}`,
    method: "DELETE",
    responseSchema: deletePromotionFormResponseSchema,
  });
}
