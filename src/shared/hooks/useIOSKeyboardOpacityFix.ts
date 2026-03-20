"use client";

import { useCallback, useEffect, useRef } from "react";

import type { TouchEvent } from "react";

function isIOSLikeBrowser() {
  if (typeof window === "undefined") return false;

  const ua = window.navigator.userAgent;

  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

interface UseIOSKeyboardOpacityFixOptions {
  enabled?: boolean;
}

export function useIOSKeyboardOpacityFix<
  T extends HTMLInputElement | HTMLTextAreaElement
>(options: UseIOSKeyboardOpacityFixOptions = {}) {
  const { enabled = true } = options;

  const ref = useRef<T | null>(null);
  const hiddenRef = useRef(false);
  const focusFallbackTimerRef = useRef<number | null>(null);

  const restoreOpacity = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    hiddenRef.current = false;
    element.style.opacity = "1";
  }, []);

  const clearFocusFallbackTimer = useCallback(() => {
    if (focusFallbackTimerRef.current === null) return;
    window.clearTimeout(focusFallbackTimerRef.current);
    focusFallbackTimerRef.current = null;
  }, []);

  const scheduleOpacityRestoreFallback = useCallback(() => {
    clearFocusFallbackTimer();
    focusFallbackTimerRef.current = window.setTimeout(() => {
      restoreOpacity();
      focusFallbackTimerRef.current = null;
    }, 220);
  }, [clearFocusFallbackTimer, restoreOpacity]);

  useEffect(() => {
    const handleViewportChange = () => {
      if (!enabled || !isIOSLikeBrowser()) return;
      if (!hiddenRef.current) return;

      const visualViewport = window.visualViewport;

      if (!visualViewport) {
        restoreOpacity();
        return;
      }

      const keyboardHeight = window.innerHeight - visualViewport.height;

      if (keyboardHeight > 80) {
        restoreOpacity();
      }
    };

    window.visualViewport?.addEventListener("resize", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange
      );
    };
  }, [enabled, restoreOpacity]);

  useEffect(() => {
    return () => {
      clearFocusFallbackTimer();
    };
  }, [clearFocusFallbackTimer]);

  /**
   * iOS에서 키보드 올라올 때 입력이 번쩍이는 문제 완화: 포커스 직전에만 투명 처리 후 focus.
   * 터치·포커스·전송 직후 재포커스 등 동일 경로로 쓴다.
   */
  const applyIosKeyboardOpacityFixFocus = useCallback(() => {
    if (!enabled || !isIOSLikeBrowser()) return false;
    const element = ref.current;
    if (!element) return false;
    if (hiddenRef.current) return false;
    if (document.activeElement === element) return false;

    hiddenRef.current = true;
    element.style.opacity = "0";
    element.focus({ preventScroll: true });
    scheduleOpacityRestoreFallback();
    return true;
  }, [enabled, scheduleOpacityRestoreFallback]);

  const handleTouchStart = useCallback(
    (event: TouchEvent<T>) => {
      if (!applyIosKeyboardOpacityFixFocus()) return;
      event.preventDefault();
    },
    [applyIosKeyboardOpacityFixFocus]
  );

  const handleFocus = useCallback(() => {
    if (!hiddenRef.current) return;
    scheduleOpacityRestoreFallback();
  }, [scheduleOpacityRestoreFallback]);

  const handleBlur = useCallback(() => {
    clearFocusFallbackTimer();
    restoreOpacity();
  }, [clearFocusFallbackTimer, restoreOpacity]);

  return {
    ref,
    applyIosKeyboardOpacityFixFocus,
    onTouchStart: handleTouchStart,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
}
