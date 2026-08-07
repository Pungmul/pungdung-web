"use client";

import { useRouter } from "next/navigation";

import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useNearLightningQuery } from "@/features/home";
import { useUserLocation } from "@/features/location";

import { ThunderIconFilled } from "@/shared/components/Icons";

import { NearLightningCard } from "../../../ui/nearby/NearLightningCard";

export function NearLightningContent() {
  useUserLocation();

  const { data: nearLightning } = useNearLightningQuery();
  const router = useRouter();

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
            className="!w-[280px] !aspect-[16/9] cursor-pointer bg-background rounded-[4px] border-[2px] border-dashed border-grey-400"
            onClick={() => {
              router.push(
                "/lightning" +
                  (nearLightning && nearLightning.length > 0 ? "" : "/build")
              );
            }}
          >
            <div className="cursor-pointer flex flex-col items-center justify-center h-full gap-2">
              {nearLightning && nearLightning.length == 0 && (
                <div className="flex flex-col items-center justify-center gap-1">
                  <h1 className="text-center text-grey-400 font-normal text-sm">
                    지금 근처에 번개가 없어요.
                  </h1>
                  <h1 className="text-center text-grey-400 font-normal text-sm">
                    번개를 만들어보세요.
                  </h1>
                </div>
              )}
              <span className="size-12 flex items-center justify-center">
                <ThunderIconFilled className="size-full text-grey-800" />
              </span>
              <h1 className="text-center text-grey-400 font-semibold text-sm">
                {nearLightning && nearLightning.length > 0
                  ? "번개 더 찾아보기"
                  : "번개 만들기"}
              </h1>
            </div>
          </SwiperSlide>
        </>
      </Swiper>
      <div className="swiper-pagination"></div>
    </div>
  );
}
