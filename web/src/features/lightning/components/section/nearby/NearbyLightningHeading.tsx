"use client";

import { locationStore } from "@/features/location";

import { cn } from "@/shared/lib";

import {
  getNearbyLightningTitlePrefix,
  NEARBY_LIGHTNING_TITLE_PLACEHOLDER,
} from "../../../lib/nearby-lightning-title";

type NearbyLightningHeadingProps = {
  as?: "h2" | "span";
  className?: string;
  accent?: boolean;
};

export function NearbyLightningHeading({
  as: Tag = "span",
  className,
  accent = false,
}: NearbyLightningHeadingProps) {
  const locationSource = locationStore((state) => state.locationSource);
  const prefix = getNearbyLightningTitlePrefix(locationSource);

  if (prefix == null) {
    return (
      <Tag className={cn(className, "invisible")} aria-hidden>
        {NEARBY_LIGHTNING_TITLE_PLACEHOLDER}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {prefix}{" "}
      {accent ? <span className="text-secondary">번개</span> : "번개"}
    </Tag>
  );
}
