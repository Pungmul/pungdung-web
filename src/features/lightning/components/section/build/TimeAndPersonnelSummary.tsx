"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useLightningBuildSummaryForm } from "../../../hooks/form";
import { SummaryToken } from "../../ui";

export function TimeAndPersonnelSummary() {
  const { lightningType, location, setBuildStep } =
    useLightningBuildSummaryForm();

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium text-grey-600 flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1">
          어느 <span className="text-grey-700 font-bold">시간</span>까지{" "}
          <span className="text-grey-700 font-bold">몇 명</span>을
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            truncate
            icon={<span className="flex size-4 items-center justify-center"><MapPinIcon className="size-full stroke-[1.5px] stroke-grey-500" /></span>}
            onClick={() => setBuildStep("SelectLocation")}
          >
            {location}
          </SummaryToken>
          <span className="text-grey-600 shrink-0">{"에서"}</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            onClick={() => setBuildStep("SelectType")}
          >
            {lightningType}{" "}
            <span className="flex size-4 items-center justify-center"><ChevronDownIcon className="size-full stroke-[1.5px] stroke-grey-500" /></span>
          </SummaryToken>
          <span className="text-secondary font-bold">번개<span className="font-medium text-grey-600">{"를"}</span></span>위해
          모아볼까요?
        </div>
      </h2>
    </div>
  );
}
