"use client";

import { useCallback, useEffect, useRef } from "react";

import { useQuery } from "@tanstack/react-query";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

import { useLightningJoinAction } from "../../../hooks/actions";
import { lightningQueries } from "../../../queries";
import { LightningCardRefType, LightningMeeting } from "../../../types";
import { AddLightningCard, LightningCard } from "../../ui";

const LIGHTNING_CARD_SLIDE_HEIGHT = 324;

interface LightningCardListProps {
  lightningList: LightningMeeting[];
  ref: React.RefObject<SwiperRef | null>;
  callSheetUp?: () => void;
  onSelectLightningAtIndex?: (index: number) => void;
}

export function LightningCardList({
  lightningList,
  ref,
  callSheetUp,
  onSelectLightningAtIndex,
}: LightningCardListProps) {
  const { data: userPartinLightning } = useQuery(
    lightningQueries.participationStatus()
  );
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
            height: LIGHTNING_CARD_SLIDE_HEIGHT,
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
                height: LIGHTNING_CARD_SLIDE_HEIGHT,
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
                }

                onSelectLightningAtIndex?.(index);
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
            height: LIGHTNING_CARD_SLIDE_HEIGHT,
          }}
        >
          <AddLightningCard />
        </SwiperSlide>
      )}
    </Swiper>
  );
}
