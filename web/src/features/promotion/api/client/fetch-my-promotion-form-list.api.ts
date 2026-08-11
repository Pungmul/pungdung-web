import { clientApiRequest } from "@/core/api/client";

import { myPromotionFormListResponseSchema } from "./dto.schema";
import { mapPromotionFormListItemWireToClient } from "../../lib/mappers";
import type { PromotionFormListItem } from "../../types";

export async function fetchMyPromotionFormList(): Promise<
  PromotionFormListItem[]
> {
  const { formList } = await clientApiRequest({
    url: "/api/promotions/forms/me",
    responseSchema: myPromotionFormListResponseSchema,
  });
  return formList.map(mapPromotionFormListItemWireToClient);
}
