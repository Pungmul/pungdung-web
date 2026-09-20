"use client";

import { type FocusEventHandler, useCallback, useEffect, useRef } from "react";

function isNodeInside(root: HTMLElement | null, node: EventTarget | null) {
  return node instanceof Node && Boolean(root?.contains(node));
}

// 목록 안 포커스 이동은 필드 blur로 보지 않음
// 셀렉트 밖으로 포커스가 확정된 뒤에만 onBlur를 호출함
export function useSelectContainedBlur(
  onBlur: FocusEventHandler<HTMLElement> | undefined
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const blurFrameRef = useRef<number | null>(null);

  const cancelPendingBlur = useCallback(() => {
    if (blurFrameRef.current === null) {
      return;
    }

    cancelAnimationFrame(blurFrameRef.current);
    blurFrameRef.current = null;
  }, []);

  useEffect(() => cancelPendingBlur, [cancelPendingBlur]);

  const handleFocus = useCallback(() => {
    cancelPendingBlur();
  }, [cancelPendingBlur]);

  const handleBlur = useCallback<FocusEventHandler<HTMLElement>>(
    (event) => {
      if (!onBlur) {
        return;
      }

      if (isNodeInside(rootRef.current, event.relatedTarget)) {
        return;
      }

      cancelPendingBlur();
      blurFrameRef.current = requestAnimationFrame(() => {
        blurFrameRef.current = null;

        if (isNodeInside(rootRef.current, document.activeElement)) {
          return;
        }

        onBlur(event);
      });
    },
    [cancelPendingBlur, onBlur]
  );

  return { rootRef, handleBlur, handleFocus };
}
