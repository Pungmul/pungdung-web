"use client";

import { resolveBuildProgressPercent } from "../../../lib";
import { useLightningBuildStore } from "../../../providers";

export function BuildProgressBar() {
  const buildStep = useLightningBuildStore((state) => state.buildStep);
  const progress = resolveBuildProgressPercent(buildStep);

  return (
    <div className="w-full h-1 bg-grey-200">
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
