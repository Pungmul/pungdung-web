import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { boardMetadataDtoSchema } from "./dto.schema";
import { mapBoardMetadata } from "../../lib/mappers/map-board-metadata";

export const fetchBoardInfo = (boardId: number) =>
  withResponseMapper({
    context: "fetchBoardInfo",
    fetchDto: () =>
      clientApiRequest({
        url: `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/boards/${boardId}/info`,
        responseSchema: boardMetadataDtoSchema,
      }),
    map: mapBoardMetadata,
  });
