"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { TOAST_CONTAINER_ID } from "@/shared/constants/toast.constant";
import { cn } from "@/shared/lib";

import { DevToastTrigger } from "./DevToastTrigger";
import Toast from "../ui/Toast";

// main-shell(z-0) 안이면 body 모달 포탈에 가려짐

// 모바일 하단 탭 높이 4rem
const TOAST_MOBILE_BOTTOM_CLASS =
  "max-md:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))]";

const TOAST_DESKTOP_TOP_CLASS =
  "md:top-[max(0.75rem,env(safe-area-inset-top))]";

export function ToastHost() {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <>
      <div
        id={TOAST_CONTAINER_ID}
        className={cn(
          "pointer-events-none fixed z-toast flex items-center gap-2 px-4 [&>*]:pointer-events-auto",
          "max-md:inset-x-0 max-md:top-auto max-md:flex-col-reverse",
          TOAST_MOBILE_BOTTOM_CLASS,
          TOAST_DESKTOP_TOP_CLASS,
          "md:inset-x-0 md:bottom-auto md:flex-col",
        )}
      />
      <Toast containerId={TOAST_CONTAINER_ID} />
      <DevToastTrigger />
    </>,
    portalTarget,
  );
}
