import { clientApiRequest } from "@/core/api/client";

import { formSaveResponseSchema } from "./dto.schema";
import {
  mapPromotionFormSaveAckWireToClient,
  mapPromotionFormSavePayloadToWire,
} from "../../lib/mappers";
import type { PromotionFormSavePayload } from "../../types";

export async function savePromotionForm(
  formId: number,
  form: PromotionFormSavePayload
) {
  const wire = await clientApiRequest({
    url: `/api/promotions/forms/${formId}/save`,
    method: "POST",
    body: mapPromotionFormSavePayloadToWire(form),
    responseSchema: formSaveResponseSchema,
  });
  return mapPromotionFormSaveAckWireToClient(wire);
}
