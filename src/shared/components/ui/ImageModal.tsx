"use client";
import React, { useCallback, useEffect, useRef,useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, PanInfo, useAnimate } from "framer-motion";

import { Responsive } from "../Responsive";

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isIndicatorVisible, setIsIndicatorVisible] = useState(true);
  const [imageContainerRef, animateImageContainer] =
    useAnimate<HTMLDivElement>();
  const controlsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    setIsClient(true);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentIndex(initialIndex);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      setIsIndicatorVisible(true);
    };
  }, [isOpen, initialIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : images.length - 1,
    );
  }, [images.length]);

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

  const onBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  // 컨트롤 요소들의 visibility 토글
  const toggleControls = useCallback((visible: boolean) => {
    controlsRef.current.forEach((element) => {
      if (element) {
        element.style.opacity = visible ? "1" : "0";
        element.style.pointerEvents = visible ? "auto" : "none";
      }
    });
  }, []);

  // 이미지 transform 적용
  const updateImageTransform = useCallback(
    (translateY: number, withTransition: boolean = false) => {
      if (imageContainerRef.current) {
        imageContainerRef.current.style.transform = `translateY(${translateY}px)`;
        imageContainerRef.current.style.transition = withTransition
          ? "transform 0.3s ease-out"
          : "none";
      }
    },
    [imageContainerRef],
  );

  // 드래그 중 (터치/마우스 공통)
  const handleDragMove = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      animateImageContainer(
        imageContainerRef.current,
        { y: info.offset.y, opacity: 0.5, scale: 0.9 },
        { duration: 0 },
      );
    },
    [imageContainerRef],
  );

  // 드래그 끝 (터치/마우스 공통)
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 160 || info.velocity.y > 500) {
        onClose();
      } else if (info.offset.y < -160 || info.velocity.y < -500) {
        onClose();
      } else {
        // 원래 위치로 복귀
        animateImageContainer(
          imageContainerRef.current,
          { y: 0, opacity: 1, scale: 1 },
          { duration: 0.3, ease: "easeOut" },
        );
        updateImageTransform(0, true);
        toggleControls(true);
      }
    },
    [onClose, updateImageTransform, toggleControls, imageContainerRef],
  );

  const toggleIndicator = useCallback(() => {
    setIsIndicatorVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isClient || !isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 w-dvh h-app justify-center flex flex-col">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-black/90"
          onClick={onBackdropClick}
        />

        <div className="absolute top-4 right-4 z-10 ">
          <button
            onClick={onClose}
            className="size-12 p-2 flex items-center justify-center"
          >
            <XMarkIcon className="size-full text-white" />
          </button>
        </div>

        {/* Previous button */}
        {images.length > 1 && currentIndex > 0 && (
          <section
            ref={(el) => {
              if (el) controlsRef.current[0] = el;
            }}
            className="absolute top-0 left-4 z-10 h-full flex items-center justify-center"
            onClick={onClose}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className={
                "z-10 flex size-8 items-center justify-center rounded-full bg-background bg-opacity-50 text-grey-800 transition-all hover:bg-opacity-70 " +
                (isIndicatorVisible ? "block" : "hidden")
              }
              title="이전 이미지"
            >
              <ChevronLeftIcon className="size-full" />
            </button>
          </section>
        )}

        {/* Image container */}
        {isOpen && (
          <motion.div
            ref={imageContainerRef}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.5}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            onDrag={handleDragMove}
            onDragEnd={handleDragEnd}
            onClick={toggleIndicator}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full rounded-lg overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center">
              <Responsive
                mobile={
                  <div className="w-full h-full py-16 px-12">
                    <div className="relative w-full h-full">
                      <Image
                        src={currentImage}
                        alt={`이미지 ${currentIndex + 1}`}
                        fill
                        draggable={false}
                        className="object-contain"
                      />
                    </div>
                  </div>
                }
                desktop={
                  <div className="w-full h-full py-20 px-64">
                    <div className="relative w-full h-full">
                      <Image
                        src={currentImage}
                        alt={`이미지 ${currentIndex + 1}`}
                        fill
                        draggable={false}
                        className="object-contain aspect-auto"
                      />
                    </div>
                  </div>
                }
              />
            </div>
          </motion.div>
        )}

        {/* Next button */}
        {images.length > 1 && currentIndex < images.length - 1 && (
          <section
            ref={(el) => {
              if (el) controlsRef.current[1] = el;
            }}
            className="absolute top-0 right-4 z-10 h-full flex items-center justify-center"
            onClick={onClose}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className={
                "z-10 flex size-8 items-center justify-center rounded-full bg-background bg-opacity-50 text-grey-800 transition-all hover:bg-opacity-70 " +
                (isIndicatorVisible ? "block" : "hidden")
              }
              title="다음 이미지"
            >
              <ChevronRightIcon className="size-full" />
            </button>
          </section>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div
            ref={(el) => {
              if (el) controlsRef.current[2] = el;
            }}
            className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-3 py-2 bg-background bg-opacity-50 text-grey-800 text-sm rounded-full ${
              isIndicatorVisible ? "block" : "hidden"
            }`}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </AnimatePresence>,
    document.body,
  );
};

export default ImageModal;
