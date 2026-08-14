"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

import { updateUserLocation } from "../api/client";
import { locationQueryKeys } from "../constant";
import { locationStore } from "../store/locationStore";

type LocationAllowCtaProps = {
  onAllowed?: () => void | Promise<void>;
};

export function LocationAllowCta({ onAllowed }: LocationAllowCtaProps) {
  const queryClient = useQueryClient();
  const locationSource = locationStore((state) => state.locationSource);
  const [tooltipPinned, setTooltipPinned] = useState(false);
  const [tooltipHovered, setTooltipHovered] = useState(false);
  const [isAllowing, setIsAllowing] = useState(false);
  const tooltipOpen = tooltipPinned || tooltipHovered;

  if (locationSource === "gps") {
    return null;
  }

  const handleAllow = async () => {
    if (isAllowing) {
      return;
    }

    const previousView = locationStore.getState().getLocationView();
    setIsAllowing(true);

    try {
      const position = await locationStore.getState().requestGpsPosition();
      await updateUserLocation({
        latitude: position.latitude,
        longitude: position.longitude,
      });
      await queryClient.invalidateQueries({
        queryKey: locationQueryKeys.user(),
      });
      await onAllowed?.();
    } catch {
      locationStore.getState().setLocationView(previousView);
    } finally {
      setIsAllowing(false);
    }
  };

  return (
    <div className="relative z-30 flex shrink-0 items-center gap-[6px] overflow-visible">
      <button
        type="button"
        disabled={isAllowing}
        className="flex items-center justify-center rounded-[4px] border border-grey-500 bg-background px-[6px] py-[4px] text-[12px] text-grey-600 disabled:opacity-50"
        onClick={() => void handleAllow()}
      >
        내 위치 공유
      </button>
      <span
        className="relative inline-flex shrink-0 items-center overflow-visible"
        onMouseEnter={() => setTooltipHovered(true)}
        onMouseLeave={() => setTooltipHovered(false)}
      >
        <button
          type="button"
          className="size-6 text-grey-500"
          aria-label="위치 정보 안내"
          aria-expanded={tooltipOpen}
          onClick={() => setTooltipPinned((open) => !open)}
        >
          <ExclamationCircleIcon className="size-6" />
        </button>
        {tooltipOpen ? (
          <span
            role="tooltip"
            className="absolute right-0 top-[calc(100%+4px)] z-30 w-56 bg-[#222222]/80 px-3 py-2 text-[12px] leading-5 text-white"
          >
            위치 정보를 이용하면 내 주변의 정보를 받아올 수 있어요
          </span>
        ) : null}
      </span>
    </div>
  );
}
