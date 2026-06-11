"use client";

import { useCallback } from "react";

import type { RefObject } from "react";

/**
 * 제출 성공 후 한 번에 맞출 것만 묶음: DOM 비우기 → 아이콘 기본 톤 → 높이 되돌림.
 * (높이·아이콘 훅과 달리, 여기만 묶인 이유는 “초기화 한 번”의 경계.)
 */
export function useCommentBottomFieldReset(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  setSendIconActive: (active: boolean) => void,
  adjustHeight: () => void
) {
  const resetCommentInput = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    setSendIconActive(false);
    adjustHeight();
  }, [adjustHeight, setSendIconActive, textareaRef]);

  return { resetCommentInput };
}
