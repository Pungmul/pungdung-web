"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { throttle } from "lodash";
import type { RefObject } from "react";

interface UseAnchorDropdownPlacementParams {
  anchorRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  onAnchorOutsideViewport?: () => void;
  throttleMs?: number;
}

export function useAnchorDropdownPlacement({
  anchorRef,
  enabled,
  onAnchorOutsideViewport,
  throttleMs = 1000,
}: UseAnchorDropdownPlacementParams) {
  const [openUpward, setOpenUpward] = useState(false);

  const updatePlacement = useCallback(() => {
    if (!anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      onAnchorOutsideViewport?.();
      return;
    }

    const lowerViewportThreshold = (window.innerHeight / 3) * 2;
    setOpenUpward(rect.top > lowerViewportThreshold);
  }, [anchorRef, onAnchorOutsideViewport]);

  const throttledUpdatePlacement = useMemo(
    () => throttle(updatePlacement, throttleMs),
    [throttleMs, updatePlacement]
  );

  useEffect(() => {
    if (!enabled) return;

    updatePlacement();
    window.addEventListener("scroll", throttledUpdatePlacement, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", throttledUpdatePlacement, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", throttledUpdatePlacement, {
        capture: true,
      });
      window.removeEventListener("resize", throttledUpdatePlacement);
      throttledUpdatePlacement.cancel();
    };
  }, [enabled, throttledUpdatePlacement, updatePlacement]);

  return { openUpward };
}
