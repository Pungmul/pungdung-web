import type { BriefBoardInfoDto } from "../../api/client/dto.schema";
import type { BoardSummary } from "../../types/board-summary.types";

const buildFallbackDescription = (name: string) => `'${name}' 게시판 입니다.`;

export function mapBriefBoardInfoDtoToBoardSummary(
  dto: BriefBoardInfoDto
): BoardSummary {
  return {
    id: dto.id,
    parentId: dto.parentId,
    name: dto.name,
    description: dto.description ?? buildFallbackDescription(dto.name),
  };
}
