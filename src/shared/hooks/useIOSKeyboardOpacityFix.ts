"use client";

import { useCallback, useEffect, useRef } from "react";

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

  useEffect(() => {
    const handleViewportChange = () => {
      if (!enabled || !isIOSLikeBrowser()) return;
      if (!hiddenRef.current) return;

      const visualViewport = window.visualViewport;

      if (!visualViewport) {
        const element = ref.current;
        if (!element) return;

        hiddenRef.current = false;
        element.style.opacity = "1";
        return;
      }

      const keyboardHeight = window.innerHeight - visualViewport.height;

      if (keyboardHeight > 80) {
        const element = ref.current;
        if (!element) return;

        hiddenRef.current = false;
        element.style.opacity = "1";
      }
    };

    window.visualViewport?.addEventListener("resize", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange
      );
    };
  }, [enabled]);

  /**
   * iOS에서 키보드 올라올 때 입력이 번쩍이는 문제 완화: 포커스 직전에만 투명 처리 후 focus.
   * 터치·포커스·전송 직후 재포커스 등 동일 경로로 쓴다.
   */
  const applyIosKeyboardOpacityFixFocus = useCallback(() => {
    if (!enabled || !isIOSLikeBrowser()) return;
    const element = ref.current;
    if (!element) return;
    if (hiddenRef.current) return;
    if (document.activeElement === element) return;

    hiddenRef.current = true;
    element.style.opacity = "0";
    element.focus();
  }, [enabled]);

  return {
    ref,
    applyIosKeyboardOpacityFixFocus,
    onBlur: () => {
      const element = ref.current;
      if (!element) return;
      element.style.opacity = "1";
    },
  };
}
