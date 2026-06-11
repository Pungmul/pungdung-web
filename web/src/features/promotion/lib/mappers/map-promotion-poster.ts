import type { PromotionPosterWire } from "../../api/client/dto.schema";
import type { PromotionPoster } from "../../types/promotion.types";

export function mapPromotionPosterWireToClient(
  wire: PromotionPosterWire
): PromotionPoster {
  return { id: wire.id, imageUrl: wire.imageUrl };
}
