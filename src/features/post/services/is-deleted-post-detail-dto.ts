import type { PostDetailResponseDto } from "../api/client/dto.schema";

const DELETED_POST_TITLE = "삭제된 게시글";

/** 삭제·비공개 등으로 본문을 내리지 않는 껍데기 응답인지 판별한다. */
export function isDeletedPostDetailDto(dto: PostDetailResponseDto): boolean {
  if (dto.title.trim() === DELETED_POST_TITLE) return true;
  return (
    dto.categoryId == null && dto.author == null && dto.content === ""
  );
}
