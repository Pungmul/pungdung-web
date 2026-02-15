"use client";

import { useCallback, useEffect, useRef } from "react";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { useLightningJoinAction } from "../../../hooks/actions";
import {
  LightningCardRefType,
  LightningMeeting,
  UserParticipationData,
} from "../../../types";
import { AddLightningCard, LightningCard } from "../../ui";

interface LightningCardListProps {
  lightningList: LightningMeeting[];
  userPartinLightning: UserParticipationData | undefined;
  ref: React.RefObject<SwiperRef | null>;
  callSheetUp?: () => void;
}

export function LightningCardList({
  lightningList,
  userPartinLightning,
  ref,
  callSheetUp,
}: LightningCardListProps) {
  const { handleJoinLightningMeeting } = useLightningJoinAction();

  const cardRefs = useRef<Map<string, LightningCardRefType>>(new Map());
  const currentFocusedRef = useRef<LightningCardRefType | null>(null);

  const setCardRef = useCallback(
    (id: string, cardRef: LightningCardRefType | null) => {
      if (cardRef) {
        cardRefs.current.set(id, cardRef);
      } else {
        cardRefs.current.delete(id);
      }
    },
    [],
  );

  const focusCard = useCallback((id: string) => {
    currentFocusedRef.current?.blur();

    const nextRef = cardRefs.current.get(id) ?? null;
    currentFocusedRef.current = nextRef;

    nextRef?.focus();
  }, []);

  useEffect(() => {
    const swiper = ref.current?.swiper;
    if (!swiper || lightningList.length === 0) return;

    const handleSlideChange = () => {
      const activeMeeting = lightningList[swiper.activeIndex];
      if (!activeMeeting) return;

      focusCard(String(activeMeeting.id));
    };

    swiper.on("slideChange", handleSlideChange);

    return () => {
      swiper.off("slideChange", handleSlideChange);
    };
  }, [focusCard, lightningList, ref]);

  return (
    <Swiper
      ref={ref}
      slidesPerView="auto"
      spaceBetween={12}
      centeredSlides
      className="w-full py-[24px]"
    >
      {lightningList.length === 0 && userPartinLightning?.participant ? (
        <SwiperSlide
          style={{
            width: "calc(100% - 48px)",
            maxWidth: 342,
            height: 328,
          }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-lg font-semibold">번개가 없습니다.</div>
          </div>
        </SwiperSlide>
      ) : (
        lightningList.map((lightningMeeting, index) => {
          const meetingId = String(lightningMeeting.id);

          return (
            <SwiperSlide
              key={`lightning-card-${meetingId}`}
              style={{
                width: "calc(100% - 48px)",
                maxWidth: 342,
                height: 328,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                const swiper = ref.current?.swiper;
                if (!swiper) return;

                if (swiper.activeIndex === index) {
                  callSheetUp?.();
                  return;
                }

                swiper.slideTo(index);
                focusCard(meetingId);
              }}
            >
              <LightningCard
                {...lightningMeeting}
                isParticipated={
                  lightningMeeting.id ===
                  userPartinLightning?.lightningMeeting?.id
                }
                onJoinLightning={handleJoinLightningMeeting}
                onRefSet={(cardRef) => setCardRef(meetingId, cardRef)}
              />
            </SwiperSlide>
          );
        })
      )}

      {!userPartinLightning?.participant && (
        <SwiperSlide
          style={{
            width: "calc(100% - 48px)",
            maxWidth: 342,
            height: 328,
          }}
        >
          <AddLightningCard />
        </SwiperSlide>
      )}
    </Swiper>
  );
}