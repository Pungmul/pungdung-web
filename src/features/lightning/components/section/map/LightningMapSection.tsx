"use client";

import { useState } from "react";

import type { RefObject } from "react";
import type { SwiperRef } from "swiper/react";

import { MapContainer, Spinner } from "@/shared";
import { GPSOutline } from "@/shared/components/Icons";
import { useView } from "@/shared/lib/view/view-store-provider";

import {
  useLightningCardMapSync,
  useLightningCurrentLocationOnMap,
  useLightningMapBottomSheetSync,
  useLightningMapCamera,
  useLightningMarkers,
  useMapPanToCurrentLocationRef,
} from "../../../hooks/view-model";
import type { LightningBottomSheetRefType, LightningMeeting } from "../../../types";

type LightningMapSectionProps = {
  bottomSheetRef: RefObject<LightningBottomSheetRefType | null>;
  swiperRef: RefObject<SwiperRef | null>;
  lightningList: LightningMeeting[];
  mapPanToCurrentRef: RefObject<(() => void) | null>;
};

export function LightningMapSection(props: LightningMapSectionProps) {
  const view = useView();
  const [isMapReady, setIsMapReady] = useState(false);
  const {
    bottomSheetRef,
    lightningList,
    mapPanToCurrentRef,
    swiperRef,
  } = props;
  const { mapRef, panToCenter } = useLightningMapCamera({ bottomSheetRef });
  const { currentLocation, isLocationLoaded, panToCurrentLocation } =
    useLightningCurrentLocationOnMap({
      mapRef,
      isMapReady,
      panToCenter,
    });
  const { moveToLightningId } = useLightningCardMapSync({
    swiperRef,
    lightningList,
    panToCenter,
    enabled: isMapReady,
  });

  useLightningMapBottomSheetSync({ bottomSheetRef, mapRef, isMapReady });
  useMapPanToCurrentLocationRef({
    mapPanToCurrentRef,
    panToCurrentLocation,
  });
  useLightningMarkers({
    mapRef,
    lightningList,
    onMarkerClick: moveToLightningId,
  });

  return (
    <section className="flex-grow w-full h-full relative md:-left-[8px]">
      <MapContainer
        key={`lightning-map-${view}`}
        mapRef={mapRef}
        className="w-[calc(100%+8px)] h-full"
        initialLocation={currentLocation}
        setIsMapReady={setIsMapReady}
      >
        {!(isLocationLoaded && isMapReady) && (
          <div className="absolute w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-10">
            <Spinner
              size={32}
              baseColor="transparent"
              highlightColor="#FFFFFF"
            />
          </div>
        )}
        {currentLocation && (
          <div
            className="hidden md:flex absolute w-[48px] h-[48px] items-center justify-center cursor-pointer shadow-lg z-10 rounded-full bottom-[16px] bg-background right-[16px]"
            onClick={panToCurrentLocation}
          >
            <span className="flex size-6 items-center justify-center">
              <GPSOutline className="size-full text-grey-700" />
            </span>
          </div>
        )}
      </MapContainer>
    </section>
  );
}
