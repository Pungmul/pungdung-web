import dayjs from "dayjs";

import type { RemainingParts } from "../types";

const FLASH_MS = 200;

/**
 * 목표 시각까지 남은 분·초를 계산한다.
 */
export function computeRemainingParts(timeString: string): RemainingParts {
  const diff = dayjs(timeString).diff(dayjs(), "second");
  return {
    minutes: Math.floor(diff / 60),
    seconds: diff % 60,
  };
}

/**
 * textContent를 파싱한 정수 값을 반환한다. 파싱 실패 시 0을 반환.
 */
export function readDisplayedInt(text: string | null | undefined): number {
  if (!text) return 0;
  const n = parseInt(text, 10);
  return Number.isNaN(n) ? 0 : n;
}

/**
 * el의 숫자를 갱신하고, 변경 시 배경 플래시 효과를 적용한다.
 * 변경이 없으면 아무 작업도 하지 않는다.
 *
 * @returns setTimeout id (플래시 취소용), 변경 없으면 undefined
 */
export function applyDigitUpdateWithFlash(
  el: HTMLDivElement | null,
  newValue: number,
  onFlashComplete: (id: number) => void
): number | undefined {
  if (!el) return undefined;

  const current = readDisplayedInt(el.textContent);
  if (current === newValue) return undefined;

  el.style.backgroundColor = "var(--color-grey-100)";
  el.style.transition = "var(--background) 0.2s ease-in-out";
  el.textContent = newValue.toString().padStart(2, "0");

  const id = window.setTimeout(() => {
    if (el) {
      el.style.backgroundColor = "var(--background)";
    }
    onFlashComplete(id);
  }, FLASH_MS);

  return id;
}
