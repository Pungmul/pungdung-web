"use client";

import { BUILD_STEPS } from "../../../constants";
import { useLightningBuildStore } from "../../../providers";

const PROGRESS_STEPS = BUILD_STEPS.slice(0, 4);

export function BuildProgressBar() {
  const buildStep = useLightningBuildStore((state) => state.buildStep);
  const currentStepIndex = PROGRESS_STEPS.indexOf(buildStep);
  const progress =
    currentStepIndex === -1
      ? 100
      : ((currentStepIndex + 1) / PROGRESS_STEPS.length) * 100;

  return (
    <div className="w-full h-1 bg-grey-200">
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
