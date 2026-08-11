import { clientApiRequest } from "@/core/api/client";

import { promotionDetailSchema } from "./dto.schema";
import { mapPromotionDetailWireToClient } from "../../lib/mappers";
import type { PromotionDetail } from "../../types";

export async function fetchPromotionDetail(
  publicId: string
): Promise<PromotionDetail> {
  const wire = await clientApiRequest({
    url: `/api/promotions/detail/${publicId}`,
    responseSchema: promotionDetailSchema,
  });
  return mapPromotionDetailWireToClient(wire);
}
