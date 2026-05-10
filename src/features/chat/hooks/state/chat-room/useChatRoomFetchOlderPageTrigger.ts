"use client";

import { useMemo } from "react";

import { debounce } from "lodash";

import { INFINITE_SCROLL_DEBOUNCE_MS } from "../../../constants";

/** 무한 스크롤 상단 트리거: 스크롤 높이 저장 후 이전 페이지를 요청합니다. */
export function useChatRoomFetchOlderPageTrigger({
  fetchNextPage,
  isFetchingNextPage,
  saveScrollPosition,
}: {
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  saveScrollPosition: () => void;
}) {
  const onTrigger = useMemo(
    () =>
      debounce(
        () => {
          if (isFetchingNextPage) return;
          saveScrollPosition();
          fetchNextPage();
        },
        INFINITE_SCROLL_DEBOUNCE_MS,
        { leading: true, trailing: false },
      ),
    [fetchNextPage, isFetchingNextPage, saveScrollPosition],
  );

  return { onTrigger };
}
