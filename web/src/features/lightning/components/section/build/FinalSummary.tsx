"use client";

import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, UserGroupIcon } from "@heroicons/react/24/solid";

import { useLightningBuildSummaryForm } from "../../../hooks/form";
import { SummaryToken } from "../../ui";

export function FinalSummary() {
  const {
    lightningType,
    location,
    maxPersonnel,
    minPersonnel,
    setBuildStep,
    target,
    time,
  } = useLightningBuildSummaryForm();

  return (
    <div className="space-y-2">
      <h2 className="text-lg flex flex-col gap-1 text-grey-600">
        <span><span className="text-grey-800 font-bold">어떤 이름</span>으로</span>
        <div className="flex items-center gap-1">
          <SummaryToken onClick={() => setBuildStep("SelectTarget")}>
            {target}
          </SummaryToken>
          <span>에게</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<span className="flex size-4 items-center justify-center"><MapPinIcon className="size-full stroke-[1.5px] stroke-grey-500" /></span>}
            onClick={() => setBuildStep("SelectLocation")}
            truncate
          >
            {location}
          </SummaryToken>
          <span className="text-grey-600 shrink-0">{"에서"}</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken onClick={() => setBuildStep("SelectType")}>
            {lightningType}{" "}
            <span className="flex size-4 items-center justify-center"><ChevronDownIcon className="size-full stroke-[1.5px] stroke-grey-500" /></span>
          </SummaryToken>
          <span className="text-secondary font-bold">번개<span className="font-medium text-grey-600">{"를"}</span></span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<span className="flex size-4 items-center justify-center"><UserGroupIcon className="size-full stroke-[1.5px] fill-grey-500" /></span>}
            onClick={() => setBuildStep("SelectTimeAndPersonnel")}
            className="tracking-widest"
          >
            {minPersonnel}~{maxPersonnel}명
          </SummaryToken>
          <span>과 함께 갖자고</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<span className="flex size-4 items-center justify-center"><ClockIcon className="size-full stroke-[1.5px] stroke-grey-500" /></span>}
            onClick={() => setBuildStep("SelectTimeAndPersonnel")}
            className="tracking-widest"
          >
            {time}
          </SummaryToken>
          <span>까지 물어볼까요?</span>
        </div>
      </h2>
    </div>
  );
}
