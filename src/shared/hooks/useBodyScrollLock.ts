"use client";

import { useEffect } from "react";

const SCROLL_LOCK_COUNT_KEY = "scrollLockCount";
const PREV_OVERFLOW_KEY = "prevBodyOverflow";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const currentCount = Number(body.dataset[SCROLL_LOCK_COUNT_KEY] ?? "0");

    if (currentCount === 0) {
      body.dataset[PREV_OVERFLOW_KEY] = body.style.overflow || "";
      body.style.overflow = "hidden";
    }

    body.dataset[SCROLL_LOCK_COUNT_KEY] = String(currentCount + 1);

    return () => {
      const latestCount = Number(body.dataset[SCROLL_LOCK_COUNT_KEY] ?? "1");
      const nextCount = Math.max(0, latestCount - 1);

      if (nextCount === 0) {
        body.style.overflow = body.dataset[PREV_OVERFLOW_KEY] || "";
        delete body.dataset[SCROLL_LOCK_COUNT_KEY];
        delete body.dataset[PREV_OVERFLOW_KEY];
        return;
      }

      body.dataset[SCROLL_LOCK_COUNT_KEY] = String(nextCount);
    };
  }, [locked]);
}
