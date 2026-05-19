"use client";

import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";

const PromotionList = () => {
  return (
    <div className="flex flex-col">
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        공연 홍보
      </div>
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={16}
        freeMode={true}
        style={{ paddingTop: 24, paddingBottom: 24 }}
        modules={[FreeMode]}
        className="w-full h-full mySwiper"
      >
        <>
          <SwiperSlide style={{ width: 12 }} className="flex-shrink-0">
            <div></div>
          </SwiperSlide>
          {Array.from({ length: 8 }).map((_, index) => (
            <SwiperSlide
              key={index + "hongbo"}
              style={{ width: 140, height: 194 }}
              className="cursor-pointer"
            >
              <div className="rounded-md flex-shrink-0 w-full h-full  bg-gray-400 overflow-hidden flex flex-col shadow-md">
                <div className="flex-grow"></div>
                <div
                  className="bg-white w-full flex flex-col"
                  style={{
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 8,
                    paddingRight: 8,
                    height: 44,
                    gap: "auto",
                  }}
                >
                  <div
                    className="truncate w-full"
                    style={{ fontSize: 11, color: "#808080" }}
                  >
                    공연이름은
                    최대몇글짜까지표시됩니다리우스웨인버스라크라우치머리헤딩딩
                  </div>
                  <div className="flex flex-row justify-between">
                    <div
                      className="truncate"
                      style={{ fontSize: 11, color: "#808080" }}
                    >
                      2024.11.08(월)
                    </div>
                    <div className="flex flex-row items-center gap-1 flex-shrink-0">
                      <div
                        style={{ width: 12, height: 12 }}
                        className=" bg-gray-200"
                      />
                      <div style={{ fontSize: 11 }}>50</div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <SwiperSlide style={{ width: 12 }} className="flex-shrink-0">
            <div></div>
          </SwiperSlide>
        </>
      </Swiper>
    </div>
  );
};

export default PromotionList;