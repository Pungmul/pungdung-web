"use client";

import Link from "next/link";

import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useNearLightningQuery } from "@/features/home";
import { useUserLocation } from "@/features/location";

import { ThunderIconFilled } from "@/shared/components/Icons";

import { NearLightningCard } from "../../../ui/nearby/NearLightningCard";

export function NearLightningContent() {
  useUserLocation();

  const { data: nearLightning } = useNearLightningQuery();

  return (
    <div className="relative w-full px-[16px]">
      <Swiper
        grabCursor={true}
        modules={[Navigation, FreeMode]}
        className="mySwiper w-full h-full"
        slidesPerView="auto"
        spaceBetween={12}
      >
        <>
          {nearLightning && nearLightning.length > 0
            ? nearLightning.map((item) => (
                <SwiperSlide
                  key={"near-lightning-card-" + item.lightningMeeting.id}
                  className="!w-[280px] !aspect-[16/9]"
                >
                  <NearLightningCard {...item} />
                </SwiperSlide>
              ))
            : null}
          <SwiperSlide
            key={"add-card-slide"}
            className="!w-[280px] !aspect-[16/9]"
          >
            <Link
              href={
                "/lightning" +
                (nearLightning && nearLightning.length > 0 ? "" : "/build")
              }
              className="flex h-full flex-col items-center justify-center gap-2 rounded-[4px] border-[2px] border-dashed border-grey-400 bg-background"
            >
              {nearLightning && nearLightning.length == 0 && (
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-center text-grey-400 font-normal text-sm">
                    지금 근처에 번개가 없어요.
                  </p>
                  <p className="text-center text-grey-400 font-normal text-sm">
                    번개를 만들어보세요.
                  </p>
                </div>
              )}
              <span className="size-12 flex items-center justify-center" aria-hidden>
                <ThunderIconFilled className="size-full text-grey-800" />
              </span>
              <span className="text-center text-grey-400 font-semibold text-sm">
                {nearLightning && nearLightning.length > 0
                  ? "번개 더 찾아보기"
                  : "번개 만들기"}
              </span>
            </Link>
          </SwiperSlide>
        </>
      </Swiper>
      <div className="swiper-pagination"></div>
    </div>
  );
}
