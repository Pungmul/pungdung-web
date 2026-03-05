"use client";

import { useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import { Suspense } from "@suspensive/react";
import { AnimatePresence } from "framer-motion";

import {
  LightningInformation,
  LightningListOverlay,
  LightningMapSection,
  lightningQueries,
  useLightningBottomSheetState,
  useLightningLists,
  useLightningListViewModel,
  useSchoolLightningSocket,
  useSyncUserLocation,
  useWholeLightningSocket,
} from "@/features/lightning";

import { Spinner } from "@/shared";

import "swiper/css";
import "swiper/css/pagination";

export default function LightningPage() {
  return (
    <Suspense
      clientOnly
      fallback={
        <div className="flex items-center justify-center h-full w-full flex-grow">
          <Spinner size={32} />
        </div>
      }
    >
      <LightningPageContent />
    </Suspense>
  );
}

function LightningPageContent() {
  const { data: userParticipationData } = useQuery(
    lightningQueries.participationStatus()
  );

  useSyncUserLocation();

  useWholeLightningSocket({ userParticipationData });
  useSchoolLightningSocket({ userParticipationData });

  const { wholeLightningList, schoolLightningList } = useLightningLists();
  const { target, setTarget, lightningList } = useLightningListViewModel({
    wholeLightningList,
    schoolLightningList,
  });

  const { bottomSheetRef, swiperRef } = useLightningBottomSheetState();

  const mapPanToCurrentRef = useRef<(() => void) | null>(null);

  return (
    <AnimatePresence mode="sync" key="main-animate-presence">
      <main
        key="main-div"
        className="relative w-full h-full flex-grow flex flex-col justify-end md:flex-row-reverse overflow-hidden"
      >
        <LightningInformation userPartinLightning={userParticipationData} />
        <LightningMapSection
          lightningList={lightningList}
          bottomSheetRef={bottomSheetRef}
          swiperRef={swiperRef}
          mapPanToCurrentRef={mapPanToCurrentRef}
        />
        <LightningListOverlay
          lightningList={lightningList}
          target={target}
          setTarget={setTarget}
          bottomSheetRef={bottomSheetRef}
          swiperRef={swiperRef}
          mapPanToCurrentRef={mapPanToCurrentRef}
        />
      </main>
    </AnimatePresence>
  );
}
