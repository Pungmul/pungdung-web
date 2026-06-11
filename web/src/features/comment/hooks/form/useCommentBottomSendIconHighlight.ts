"use client";

import { useCallback } from "react";

import type { RefObject } from "react";

/** 전송 아이콘 래퍼: 입력 유무에 따른 강조 클래스만 */
export function useCommentBottomSendIconHighlight(
  sendIconWrapperRef: RefObject<HTMLSpanElement | null>
) {
  const setSendIconActive = useCallback(
    (active: boolean) => {
      const iconWrapper = sendIconWrapperRef.current;
      if (!iconWrapper) {
        return;
      }

      iconWrapper.classList.toggle("text-primary", active);
      iconWrapper.classList.toggle("text-grey-400", !active);
    },
    [sendIconWrapperRef]
  );

  return { setSendIconActive };
}
