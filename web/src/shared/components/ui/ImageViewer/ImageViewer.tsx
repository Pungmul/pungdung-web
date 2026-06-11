"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { downloadRemoteImage } from "@/shared/lib/download-remote-image";

import "swiper/css";

export interface ImageViewerItem {
  url: string;
  name?: string;
}

export type ImageViewerImages = ImageViewerItem[] | string[];

export interface ImageViewerProps {
  isOpen: boolean;
  images: ImageViewerImages;
  initialIndex?: number;
  onClose: () => void;
  enableDownload?: boolean;
}

function normalizeImages(images: ImageViewerImages): ImageViewerItem[] {
  return images.map((image, index) =>
    typeof image === "string"
      ? { url: image, name: `image-${index + 1}` }
      : image,
  );
}

export function ImageViewer({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
  enableDownload = true,
}: ImageViewerProps) {
  const normalizedImages = useMemo(() => normalizeImages(images), [images]);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const swiperRef = useRef<SwiperType | null>(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentIndex(initialIndex);
    swiperRef.current?.slideTo(initialIndex, 0);
  }, [isOpen, initialIndex]);

  const currentImage = normalizedImages[currentIndex];

  const handleOverlayDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.y > 150 || info.velocity.y > 500) {
      onClose();
    }
  };

  const handleDownload = async () => {
    if (!currentImage?.url) return;

    try {
      await downloadRemoteImage({
        url: currentImage.url,
        filename: currentImage.name || `image-${currentIndex + 1}`,
      });
    } catch (error) {
      console.error("이미지 다운로드 실패", error);
    }
  };

  const goToPrevious = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const goToNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    },
    [isOpen, onClose, goToPrevious, goToNext],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (normalizedImages.length === 0) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          key="image-viewer"
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
              {normalizedImages.length > 1 && (
                <div className="text-white text-sm font-medium">
                  {`${currentIndex + 1}/${normalizedImages.length}`}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className="absolute flex-col items-center justify-center size-10 md:size-12 p-2 md:pr-4 top-0 right-0 cursor-pointer"
                aria-label="이미지 닫기"
              >
                <XMarkIcon className="size-full text-white" />
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
                {normalizedImages.map((image, index) => (
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

            {normalizedImages.length > 1 && currentIndex > 0 && (
              <section className="hidden lg:flex absolute top-0 left-4 z-20 h-full items-center justify-center">
                <button
                  type="button"
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

            {normalizedImages.length > 1 &&
              currentIndex < normalizedImages.length - 1 && (
                <section className="hidden lg:flex absolute top-0 right-4 z-20 h-full items-center justify-center">
                  <button
                    type="button"
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

            {enableDownload && (
              <button
                type="button"
                onClick={handleDownload}
                className="absolute bottom-4 right-4 z-20 rounded-full p-3 bg-primary text-white"
                aria-label="이미지 다운로드"
              >
                <span className="size-5 flex items-center justify-center">
                  <ArrowDownTrayIcon className="size-full" />
                </span>
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
