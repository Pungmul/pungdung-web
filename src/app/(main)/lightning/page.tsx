"use client";

import { useRef } from "react";

import { Suspense } from "@suspensive/react";
import { AnimatePresence } from "framer-motion";

import {
  LightningInformation,
  LightningListOverlay,
  LightningMapSection,
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
  useSyncUserLocation();

  const normalLightningMeetings = useWholeLightningSocket();
  const schoolLightningMeetings = useSchoolLightningSocket();

  const { wholeLightningList, schoolLightningList } = useLightningLists({
    normalLightningMeetings,
    schoolLightningMeetings,
  });
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
