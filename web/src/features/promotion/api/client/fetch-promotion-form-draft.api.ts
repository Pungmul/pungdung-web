import { clientApiRequest } from "@/core/api/client";

import { formDetailDtoSchema } from "./dto.schema";
import { mapPromotionFormDraftWireToClient } from "../../lib/mappers";

export async function fetchPromotionFormDraft(formId: number) {
  const wire = await clientApiRequest({
    url: `/api/promotions/forms/${formId}`,
    responseSchema: formDetailDtoSchema,
  });
  return mapPromotionFormDraftWireToClient(wire);
}
