import { z } from "zod";

import { clientApiRequest } from "@/core/api/client";

import { responseDtoSchema } from "./dto.schema";
import { mapPromotionApplicationDetailWireToClient } from "../../lib/mappers";

export async function fetchPromotionFormResponses(formId: number) {
  const wireList = await clientApiRequest({
    url: `/api/promotions/forms/${formId}/manage`,
    responseSchema: z.array(responseDtoSchema),
  });
  return wireList.map(mapPromotionApplicationDetailWireToClient);
}
