import type { BoardHeaderDisplay } from "../types/board-header-display.types";

/** 라우트 세그먼트 등 API 보드 목록에 없는 헤더 문구 */
export const BOARD_HEADER_SYNTHETIC_BY_SEGMENT: Record<
  string,
  BoardHeaderDisplay
> = {
  "my-post": {
    name: "내 게시글",
    description: "내가 작성한 게시글 목록 입니다.",
  },
  "my-comment": {
    name: "내 댓글",
    description: "내가 작성한 댓글 목록 입니다.",
  },
  "upcoming-performance": {
    name: "관람 예정인 공연",
    description: "관람 예정인 공연 목록 입니다.",
  },
  "hot-post": {
    name: "인기 게시글",
    description: "인기 게시글 목록 입니다.",
  },
  club: {
    name: "동아리 게시판",
    description: "소속 동아리의 게시글을 확인하는 게시판입니다.",
  },
  promote: {
    name: "홍보 게시판",
    description: "공연을 홍보하는 게시판 입니다.",
  },
};
