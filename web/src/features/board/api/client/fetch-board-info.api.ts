import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardMetadataDtoSchema } from "./dto.schema";

export const fetchBoardInfo = (boardId: number) =>
  withResponseMapper({
    context: "fetchBoardInfo",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/${boardId}/info`,
        responseSchema: boardMetadataDtoSchema,
      }),
    map: (dto) => ({
      currentCategoryId: dto.currentCategoryId,
      boardInfo: {
        ...dto.boardInfo,
        rootCategoryName: dto.boardInfo.rootCategoryName ?? "",
      },
    }),
  });
