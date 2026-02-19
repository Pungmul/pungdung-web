import type { BoardSummary } from "../types";

/** 북마크된 항목을 앞에 두고, 그다음 숫자 id 오름차순·문자열 id 로케일 정렬. */
export function sortBoardsWithBookmarks(
  boards: BoardSummary[],
  bookmarkedIds: (number | string)[]
): BoardSummary[] {
  return [...boards].sort((a, b) => {
    const aMarked = bookmarkedIds.includes(a.id);
    const bMarked = bookmarkedIds.includes(b.id);

    if (aMarked && !bMarked) return -1;
    if (!aMarked && bMarked) return 1;

    if (typeof a.id === "number" && typeof b.id === "number") {
      return a.id - b.id;
    }
    return String(a.id).localeCompare(String(b.id), "ko-KR");
  });
}
