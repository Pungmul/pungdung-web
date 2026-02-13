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
            icon={<MapPinIcon className="size-4 stroke-[1.5px] stroke-grey-500" />}
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
            <ChevronDownIcon className="size-4 stroke-[1.5px] stroke-grey-500" />
          </SummaryToken>
          <span className="text-secondary font-bold">번개<span className="font-medium text-grey-600">{"를"}</span></span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<UserGroupIcon className="size-4 stroke-[1.5px] fill-grey-500" />}
            onClick={() => setBuildStep("SelectTimeAndPersonnel")}
            className="tracking-widest"
          >
            {minPersonnel}~{maxPersonnel}명
          </SummaryToken>
          <span>과 함께 갖자고</span>
        </div>
        <div className="flex items-center gap-1">
          <SummaryToken
            icon={<ClockIcon className="size-4 stroke-[1.5px] stroke-grey-500" />}
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
