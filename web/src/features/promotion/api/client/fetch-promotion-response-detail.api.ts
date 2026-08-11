import { clientApiRequest } from "@/core/api/client";

import { promotionResponseDetailDtoSchema } from "./dto.schema";
import { mapPromotionApplicationDetailWireToClient } from "../../lib/mappers";
import type { PromotionApplicationDetail } from "../../types";

export async function fetchPromotionResponseDetail(
  responseId: string
): Promise<PromotionApplicationDetail> {
  const wire = await clientApiRequest({
    url: `/api/promotions/responses/${responseId}`,
    responseSchema: promotionResponseDetailDtoSchema,
  });
  return mapPromotionApplicationDetailWireToClient(wire);
}
