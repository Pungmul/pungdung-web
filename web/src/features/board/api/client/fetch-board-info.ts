import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardDataDtoSchema } from "./dto.schema";
import { mapBoardDataDtoToBoardOverview } from "../../lib/mappers";

export const fetchBoardInfo = (boardId: number) =>
  withResponseMapper({
    context: "fetchBoardInfo",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/${boardId}/info`,
        responseSchema: boardDataDtoSchema,
      }),
    map: mapBoardDataDtoToBoardOverview,
  });
