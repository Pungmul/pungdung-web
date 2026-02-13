"use client";

import { useEffect, useRef } from "react";

import {
  applyDigitUpdateWithFlash,
  computeRemainingParts,
} from "../../lib/time-gap-panel-countdown";

const TICK_MS = 1000;

/**
 * 목표 시각까지 남은 분·초를 1초마다 ref가 가리키는 DOM에 갱신한다.
 * (리렌더 대신 imperatively 업데이트 + 배경 플래시)
 */
export function useTimeGapPannelCountdown(timeString: string) {
  const minContainerRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);
  const timeoutIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const pendingFlashes = timeoutIdsRef;
    const finishFlash = (id: number) => {
      pendingFlashes.current.delete(id);
    };

    const tick = () => {
      const { minutes, seconds } = computeRemainingParts(timeString);

      if (minContainerRef.current) {
        minContainerRef.current.style.display = minutes <= 0 ? "none" : "flex";
      }

      const minId = applyDigitUpdateWithFlash(
        minRef.current,
        minutes,
        finishFlash
      );
      if (minId !== undefined) {
        pendingFlashes.current.add(minId);
      }

      const secId = applyDigitUpdateWithFlash(
        secRef.current,
        seconds,
        finishFlash
      );
      if (secId !== undefined) {
        pendingFlashes.current.add(secId);
      }
    };

    tick();
    const interval = window.setInterval(tick, TICK_MS);

    return () => {
      window.clearInterval(interval);
      const pending = Array.from(pendingFlashes.current);
      pendingFlashes.current.clear();
      for (const id of pending) {
        window.clearTimeout(id);
      }
    };
  }, [timeString]);

  return { minContainerRef, minRef, secRef };
}
