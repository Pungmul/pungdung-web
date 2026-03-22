"use client";

import { type RefObject, useEffect } from "react";

const MOBILE_MAX_WIDTH_QUERY = "(max-width: 767px)";

function getVisualViewportMetrics() {
  const vv = window.visualViewport;
  return {
    heightPx: vv?.height ?? window.innerHeight,
    offsetTopPx: vv?.offsetTop ?? 0,
  };
}

function isMobileViewport() {
  return window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches;
}

function bindViewportHeightSync(onApply: () => void) {
  const vv = window.visualViewport;

  onApply();

  vv?.addEventListener("resize", onApply);
  vv?.addEventListener("scroll", onApply);
  window.addEventListener("resize", onApply);

  return () => {
    vv?.removeEventListener("resize", onApply);
    vv?.removeEventListener("scroll", onApply);
    window.removeEventListener("resize", onApply);
  };
}

export type UseViewportHeightVarOptions = {
  /** 모바일에서 visualViewport 높이를 html/body에 반영 */
  syncHtml?: boolean;
  /** (main) layout shell용 data-chat-room + CSS 변수 */
  chatRoomLayout?: boolean;
};

/**
 * 대상 요소에 현재 viewport height를 `--app-height`로 반영한다.
 * 채팅방 등에서 iOS 키보드/주소창 변화 시 컨테이너 높이를 맞춘다.
 */
export function useViewportHeightVar(
  targetRef: RefObject<HTMLElement | null>,
  options: UseViewportHeightVarOptions = {}
) {
  const { syncHtml = false, chatRoomLayout = false } = options;

  useEffect(() => {
    const el = targetRef.current;
    const root = document.documentElement;
    const body = document.body;

    const apply = () => {
      const { heightPx, offsetTopPx } = getVisualViewportMetrics();
      const heightValue = `${heightPx}px`;
      const offsetTopValue = `${offsetTopPx}px`;

      if (el) {
        el.style.setProperty("--app-height", heightValue);
      }

      if (chatRoomLayout) {
        root.style.setProperty("--vv-height", heightValue);
        root.style.setProperty("--vv-offset-top", offsetTopValue);
      }

      if (!syncHtml || !isMobileViewport()) return;

      root.style.height = heightValue;
      root.style.minHeight = heightValue;
      root.style.top = offsetTopValue;

      body.style.height = heightValue;
      body.style.minHeight = heightValue;
    };

    if (chatRoomLayout) {
      root.dataset.chatRoom = "";
    }

    const unbind = bindViewportHeightSync(apply);

    return () => {
      unbind();

      if (el) {
        el.style.removeProperty("--app-height");
      }

      if (chatRoomLayout) {
        root.style.removeProperty("--vv-height");
        root.style.removeProperty("--vv-offset-top");
        delete root.dataset.chatRoom;
      }

      if (syncHtml) {
        root.style.removeProperty("height");
        root.style.removeProperty("min-height");
        root.style.removeProperty("top");
        body.style.removeProperty("height");
        body.style.removeProperty("min-height");
      }
    };
  }, [targetRef, syncHtml, chatRoomLayout]);
}
