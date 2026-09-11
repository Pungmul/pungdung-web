"use client";

import type { ReactNode } from "react";

import { LocationReferenceHint } from "@/features/location";

import { Space } from "@/shared";

import { LightningNearbyTitle } from "../../section/nearby/LightningNearbyTitle";

type LightningSidebarProps = {
  target: "전체" | "우리학교";
  targetOptions: readonly ("전체" | "우리학교")[];
  setTarget: (target: "전체" | "우리학교") => void;
  children: ReactNode;
};

export function LightningSidebar({
  target,
  setTarget,
  targetOptions,
  children,
}: LightningSidebarProps) {
  return (
    <div className="relative z-10 flex h-full w-[420px] max-w-[420px] min-w-0 shrink-0 flex-col overflow-x-hidden rounded-tr-xl rounded-br-xl bg-background shadow-up-md">
      <Space h={36} />
      <LightningNearbyTitle />

      <div className="flex flex-row gap-2 px-[24px] py-[8px]">
        {targetOptions.map((item) => (
          <button
            key={"target-option-" + item}
            type="button"
            aria-pressed={target === item}
            className={
              "text-sm border border-grey-700 rounded-lg px-2 py-2 " +
              (target === item
                ? "text-background bg-grey-700"
                : "text-grey-700")
            }
            onClick={() => setTarget(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <Space h={24} />
      <div className="min-h-0 min-w-0 w-full overflow-hidden">{children}</div>
      <div className="mt-auto px-[24px] pb-[16px]">
        <LocationReferenceHint />
      </div>
    </div>
  );
}
