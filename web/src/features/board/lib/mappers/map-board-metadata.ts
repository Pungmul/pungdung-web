import type { z } from "zod";

import type { boardMetadataDtoSchema } from "../../api/client/dto.schema";

export function mapBoardMetadata(dto: z.infer<typeof boardMetadataDtoSchema>) {
  return {
    currentCategoryId: dto.currentCategoryId,
    boardInfo: {
      ...dto.boardInfo,
      rootCategoryName: dto.boardInfo.rootCategoryName ?? "",
    },
  };
}
