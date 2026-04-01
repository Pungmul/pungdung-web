import type { BoardChildCategory } from "../types";

export interface DeriveBoardTabStateParams {
  /** 현재 상세 화면의 루트 게시판 ID */
  boardId: number;
  /** 탭 후보 자식 카테고리(부모 ID와 동일한 항목은 이미 제외된 목록) */
  categories: BoardChildCategory[];
  /** URL `?tab=` 쿼리 값. 없으면 `null` */
  selectedTabId: string | null;
  /** 자식 카테고리 탭 UI를 표시할지 여부 */
  hasChildCategories: boolean;
}

export interface DeriveBoardTabStateResult {
  /** 현재 선택된 탭(없으면 `undefined`) */
  selectedCategory: BoardChildCategory | undefined;
  /** 선택된 탭의 게시판 ID */
  selectedCategoryId: number | undefined;
  /** 게시글 목록·핫글 배너에 사용할 실제 게시판 ID */
  postListBoardId: number;
  /**
   * `?tab=`이 선택 탭과 불일치할 때 URL을 `replaceState`로 맞출지 여부.
   * 공유·딥링크 시 일관된 탭 상태를 위해 사용한다.
   */
  shouldNormalizeTabQueryParam: boolean;
}

/**
 * API가 내려준 `childCategories`에서 부모 게시판과 동일 ID인 항목을 제외한다.
 * 탭 UI에는 실제 자식 게시판만 노출하기 위한 전처리다.
 */
export function getEffectiveBoardTabCategories(
  boardId: number,
  childCategories: BoardChildCategory[]
): BoardChildCategory[] {
  return childCategories.filter((category) => category.id !== boardId);
}

/**
 * URL `tab` 쿼리와 자식 카테고리 목록으로 탭 선택·목록용 boardId·URL 정규화 필요 여부를 계산한다.
 */
export function deriveBoardTabState({
  boardId,
  categories,
  selectedTabId,
  hasChildCategories,
}: DeriveBoardTabStateParams): DeriveBoardTabStateResult {
  const selectedCategory =
    categories.find((category) => String(category.id) === selectedTabId) ??
    categories[0];
  const selectedCategoryId = selectedCategory?.id;

  return {
    selectedCategory,
    selectedCategoryId,
    postListBoardId: selectedCategoryId ?? boardId,
    shouldNormalizeTabQueryParam:
      hasChildCategories &&
      selectedCategoryId !== undefined &&
      selectedTabId !== String(selectedCategoryId),
  };
}
