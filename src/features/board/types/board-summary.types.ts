/** 목록·내비게이션에서 쓰는 게시판 요약 (식별자 + 이름·설명) */
export type BoardSummary = {
  id: number | string;
  parentId: number | null;
  name: string;
  description: string;
};
