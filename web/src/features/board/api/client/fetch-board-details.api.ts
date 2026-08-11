import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardDataDtoSchema } from "./dto.schema";
import { mapBoardDataDtoToBoardOverview } from "../../lib/mappers";

export const fetchBoardDetails = (boardId: number) =>
  withResponseMapper({
    context: "fetchBoardDetails",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/${boardId}/info`,
        responseSchema: boardDataDtoSchema,
      }),
    map: mapBoardDataDtoToBoardOverview,
  });
