import { clientApiRequest } from "@/core/api/client";

import { promotionPerformanceListResponseSchema } from "./dto.schema";
import { mapPromotionListItemWireToClient } from "../../lib/mappers";
import type { Promotion } from "../../types";

export async function fetchPromotionList(): Promise<Promotion[]> {
  const { performanceList } = await clientApiRequest({
    url: "/api/promotions/list",
    responseSchema: promotionPerformanceListResponseSchema,
  });
  return performanceList.map(mapPromotionListItemWireToClient);
}
