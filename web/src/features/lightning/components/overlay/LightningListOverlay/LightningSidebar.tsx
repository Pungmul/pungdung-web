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
    <div className="relative z-10 rounded-tr-xl rounded-br-xl shadow-up-md bg-background overflow-visible flex flex-col h-full w-[640px]">
      <Space h={36} />
      <LightningNearbyTitle />

      <div className="flex flex-row gap-2 px-[24px] py-[8px]">
        {targetOptions.map((item) => (
          <div
            key={"target-option-" + item}
            className={
              "text-sm border border-grey-700 rounded-lg px-2 py-2 cursor-pointer " +
              (target === item
                ? "text-background bg-grey-700"
                : "text-grey-700")
            }
            onClick={() => setTarget(item)}
          >
            {item}
          </div>
        ))}
      </div>

      <Space h={24} />
      {children}
      <div className="mt-auto px-[24px] pb-[16px]">
        <LocationReferenceHint />
      </div>
    </div>
  );
}
