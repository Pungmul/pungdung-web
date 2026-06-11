"use client";

import { RefObject, useEffect } from "react";

interface UseClickOutsideParams {
  ref?: RefObject<HTMLElement | null>;
  refs?: Array<RefObject<HTMLElement | null>>;
  onOutsideClick: () => void;
  enabled?: boolean;
  eventType?: "mousedown" | "click";
}

export function useClickOutside({
  ref,
  refs,
  onOutsideClick,
  enabled = true,
  eventType = "mousedown",
}: UseClickOutsideParams) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const targetRefs = refs ?? (ref ? [ref] : []);
    if (targetRefs.length === 0) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const isInside = targetRefs.some(
        (targetRef) =>
          targetRef.current && targetRef.current.contains(event.target as Node)
      );

      if (!isInside) {
        onOutsideClick();
      }
    };

    document.addEventListener(eventType, handleClickOutside);

    return () => {
      document.removeEventListener(eventType, handleClickOutside);
    };
  }, [enabled, onOutsideClick, ref, refs, eventType]);
}
