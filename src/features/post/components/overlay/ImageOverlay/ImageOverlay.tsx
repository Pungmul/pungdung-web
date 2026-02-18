"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";

import {
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

import { useBodyScrollLock } from "@/shared/hooks";

import "swiper/css";

interface OverlayImage {
  url: string;
  name?: string;
}

interface ImageOverlayProps {
  isOpen: boolean;
  images: OverlayImage[];
  initialIndex?: number;
  onClose: () => void;
}

export function ImageOverlay({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
}: ImageOverlayProps) {

  // 현재 이미지 인덱스
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // Swiper 인스턴스
  const swiperRef = useRef<SwiperType | null>(null);

  // 전체 화면 오버레이 중 배경 스크롤 잠금
  useBodyScrollLock(isOpen);

  // 열릴 때마다 시작 슬라이드 초기화
  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const currentImage = useMemo(
    () => images[currentIndex],
    [images, currentIndex]
  );

  const handleOverlayDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 150 || info.velocity.y > 500) {
      onClose();
    }
  };

  const handleDownload = () => {
    if (!currentImage?.url) return;
    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = currentImage.name || `image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const goToPrevious = () => {
    swiperRef.current?.slidePrev();
  };

  const goToNext = () => {
    swiperRef.current?.slideNext();
  };

  if (images.length === 0) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          key="image-overlay"
          className="fixed inset-0 z-50 flex items-end"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full h-dvh flex flex-col items-center justify-start overflow-hidden bg-black/95"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={handleOverlayDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="w-full flex bg-black/60 flex-col justify-center items-center px-4 py-3 h-12 z-30">
              {images.length > 1 && (
                <div className="text-white text-sm font-medium">
                  {`${currentIndex + 1}` + "/" + images.length}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="absolute flex-col items-center justify-center size-10 md:size-12 p-2 md:pr-4 top-0 right-0 cursor-pointer"
                aria-label="이미지 닫기"
              >
                <XMarkIcon className="text-white" />
              </button>
            </header>

            <div className="w-full flex-1 min-h-0 pb-16 pt-12">
              <Swiper
                initialSlide={initialIndex}
                slidesPerView={1}
                spaceBetween={0}
                className="w-full h-full"
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={`${image.url}-${index}`}>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative md:max-w-3xl md:max-h-3xl w-full h-full">
                        <Image
                          src={image.url}
                          alt={image.name || `이미지 ${index + 1}`}
                          fill
                          sizes="100vw"
                          className="object-contain"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {images.length > 1 && currentIndex > 0 && (
              <section className="hidden lg:flex absolute top-0 left-4 z-20 h-full items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="size-8 p-1 flex items-center justify-center bg-white bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                  title="이전 이미지"
                >
                  <ChevronLeftIcon className="size-full text-black" />
                </button>
              </section>
            )}

            {images.length > 1 && currentIndex < images.length - 1 && (
              <section className="hidden lg:flex absolute top-0 right-4 z-20 h-full items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="size-8 p-1 flex items-center justify-center bg-white bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                  title="다음 이미지"
                >
                  <ChevronRightIcon className="size-full text-black" />
                </button>
              </section>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="absolute bottom-4 right-4 z-20 rounded-full p-3 bg-primary text-white"
              aria-label="이미지 다운로드"
            >
              <ArrowDownTrayIcon className="size-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
