"use client";

import { TOAST_CONTAINER_ID } from "@/shared/constants/toast.constant";
import { cn } from "@/shared/lib";

import Toast from "../ui/Toast";

export function ToastHost() {
  return (
    <>
      <div
        id={TOAST_CONTAINER_ID}
        className={cn(
          "pointer-events-none fixed z-20 flex items-center gap-2 px-4 [&>*]:pointer-events-auto",
          "max-md:inset-x-0 max-md:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] max-md:flex-col-reverse",
          "md:inset-x-0 md:top-[max(0.75rem,env(safe-area-inset-top))] md:bottom-auto md:flex-col"
        )}
      />
      <Toast containerId={TOAST_CONTAINER_ID} />
    </>
  );
}
