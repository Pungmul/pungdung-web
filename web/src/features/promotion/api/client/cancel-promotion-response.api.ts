import { clientApiRequest } from "@/core/api/client";

import { promotionResponseDetailDtoSchema } from "./dto.schema";
import { mapPromotionApplicationDetailWireToClient } from "../../lib/mappers";

export async function cancelPromotionResponse(responseId: string) {
  const wire = await clientApiRequest({
    url: `/api/promotions/responses/${responseId}`,
    method: "DELETE",
    responseSchema: promotionResponseDetailDtoSchema,
  });
  return mapPromotionApplicationDetailWireToClient(wire);
}
