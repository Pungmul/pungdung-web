//나중에 처리할 것
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
  const canUseFixRef = useRef(false);

  useEffect(() => {
    canUseFixRef.current = enabled && isIOSLikeBrowser();
  }, [enabled]);

  const restore = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    hiddenRef.current = false;
    element.style.opacity = "1";
  }, []);

  useEffect(() => {
    const handleViewportChange = () => {
      if (!canUseFixRef.current) return;
      if (!hiddenRef.current) return;

      const visualViewport = window.visualViewport;

      if (!visualViewport) {
        restore();
        return;
      }

      const keyboardHeight = window.innerHeight - visualViewport.height;

      if (keyboardHeight > 80) {
        restore();
      }
    };

    window.visualViewport?.addEventListener("resize", handleViewportChange);
    window.visualViewport?.addEventListener("scroll", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleViewportChange
      );
    };
  }, [restore]);

  const handleTouchStart = useCallback(() => {
    if (!canUseFixRef.current) return;

    const element = ref.current;
    if (!element) return;
    if (hiddenRef.current) return;
    if (document.activeElement === element) return;

    hiddenRef.current = true;
    element.style.opacity = "0";

    requestAnimationFrame(() => {
      element.focus();
    });

    window.setTimeout(() => {
      restore();
    }, 500);
  }, [restore]);

  const handleBlur = useCallback(() => {
    restore();
  }, [restore]);

  return {
    ref,
    onTouchStart: handleTouchStart,
    onBlur: handleBlur,
  };
}
