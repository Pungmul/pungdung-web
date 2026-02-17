"use client";

import { useCallback } from "react";

import type { RefObject } from "react";

/** textarea `scrollHeight`에 맞춰 높이만 조절 */
export function useCommentBottomTextareaHeight(
  textareaRef: RefObject<HTMLTextAreaElement | null>
) {
  const adjustHeight = useCallback(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [textareaRef]);

  return { adjustHeight };
}
