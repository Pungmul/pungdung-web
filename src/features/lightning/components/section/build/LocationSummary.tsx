"use client";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { useLightningBuildSummaryForm } from "../../../hooks/form";
import { SummaryToken } from "../../ui";

export function LocationSummary() {
  const { lightningType, setBuildStep } = useLightningBuildSummaryForm();

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold flex items-center text-grey-600 flex-wrap">
        <span>
          어느 <span className="text-grey-800">위치</span>에{" "}
        </span>
        <SummaryToken
          onClick={() => setBuildStep("SelectType")}
          className="mx-1"
        >
          {lightningType}{" "}<ChevronDownIcon className="size-4 stroke-[1.5px] stroke-grey-500" />
        </SummaryToken>
        <span className="text-secondary mr-1">번개<span className="text-grey-600">{"를"}</span> </span>만들까요?
      </h2>
    </div>
  );
}
