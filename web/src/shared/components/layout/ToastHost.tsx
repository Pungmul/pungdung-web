"use client";

import { TOAST_CONTAINER_ID } from "@/shared/constants/toast.constant";
import { cn } from "@/shared/lib";

import { DevToastTrigger } from "./DevToastTrigger";
import Toast from "../ui/Toast";

// 헤더 z-20보다 위, 하단 탭 z-30보다 아래
const TOAST_Z_INDEX_MOBILE_CLASS = "max-md:z-[25]";

// 데스크톱 헤더/사이드바 z-30보다 위
const TOAST_Z_INDEX_DESKTOP_CLASS = "md:z-40";

// 모바일 하단 탭 높이 4rem
const TOAST_MOBILE_BOTTOM_CLASS =
  "max-md:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))]";

const TOAST_DESKTOP_TOP_CLASS =
  "md:top-[max(0.75rem,env(safe-area-inset-top))]";

export function ToastHost() {
  return (
    <>
      <div
        id={TOAST_CONTAINER_ID}
        className={cn(
          "pointer-events-none fixed flex items-center gap-2 px-4 [&>*]:pointer-events-auto",
          TOAST_Z_INDEX_MOBILE_CLASS,
          "max-md:inset-x-0 max-md:top-auto max-md:flex-col-reverse",
          TOAST_MOBILE_BOTTOM_CLASS,
          TOAST_Z_INDEX_DESKTOP_CLASS,
          TOAST_DESKTOP_TOP_CLASS,
          "md:inset-x-0 md:bottom-auto md:flex-col",
        )}
      />
      <Toast containerId={TOAST_CONTAINER_ID} />
      <DevToastTrigger />
    </>
  );
}
