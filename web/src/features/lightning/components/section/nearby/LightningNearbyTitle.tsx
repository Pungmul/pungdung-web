"use client";

import { LightningLocationAllowCta } from "./LightningLocationAllowCta";
import { NearbyLightningHeading } from "./NearbyLightningHeading";

export function LightningNearbyTitle() {
  return (
    <div className="relative z-30 flex flex-row items-center justify-between gap-2 overflow-visible px-[24px] py-[8px] text-lg font-semibold">
      <NearbyLightningHeading className="min-w-0" accent />
      <LightningLocationAllowCta />
    </div>
  );
}
