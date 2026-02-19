import type { BriefBoardInfoDto } from "../../api/client/dto.schema";
import type { BoardSummary } from "../../types/board-summary.types";

export function mapBriefBoardInfoDtoToBoardSummary(
  dto: BriefBoardInfoDto
): BoardSummary {
  return {
    id: dto.id,
    parentId: dto.parentId,
    name: dto.name,
    description: dto.description,
  };
}
