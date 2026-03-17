"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/shared/lib";

type SelfProfileEditButtonProps = {
  close: () => void;
};

export function SelfProfileEditButton({ close }: SelfProfileEditButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        close();
        router.push("/my-page/edit");
      }}
      className={cn(
        "flex w-full min-h-[48px] cursor-pointer items-center justify-center rounded-xl border border-grey-500 bg-transparent px-4 py-3 text-base font-bold leading-normal text-grey-500",
        "hover:bg-grey-100 active:bg-grey-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      내 정보 변경
    </button>
  );
}
