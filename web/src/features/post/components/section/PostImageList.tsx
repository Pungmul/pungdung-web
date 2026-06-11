"use client";

import { useEffect, useRef, useState } from "react";

import { ImageObject } from "@/shared/types/image";

import { PostImage } from "../ui/PostImage";

interface PostImageListProps {
  imageList: ImageObject[];
  onImageClick: (index: number) => void;
}

export function PostImageList({ imageList, onImageClick }: PostImageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollGradient = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const hasOverflow = scrollWidth > clientWidth + 1;
      setShowLeftGradient(hasOverflow && scrollLeft > 0);
      setShowRightGradient(hasOverflow && scrollLeft + clientWidth < scrollWidth - 1);
    };

    updateScrollGradient();
    container.addEventListener("scroll", updateScrollGradient, { passive: true });
    window.addEventListener("resize", updateScrollGradient);

    return () => {
      container.removeEventListener("scroll", updateScrollGradient);
      window.removeEventListener("resize", updateScrollGradient);
    };
  }, [imageList]);

  if (!imageList.length) return null;

  return (
    <div className="relative w-full">
      <div ref={scrollRef} className="w-full overflow-x-auto py-2 scrollbar-hide">
        <div className="flex flex-row w-full gap-2 items-stretch">
          <div className="shrink-0 min-w-4" aria-hidden />
          {imageList.map((image, index) => (
            <PostImage
              key={image.id}
              imageData={image}
              onClick={() => onImageClick(index)}
            />
          ))}
          <div className="shrink-0 min-w-4" aria-hidden />
        </div>
      </div>
      {showLeftGradient && (
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background to-transparent" />
      )}
      {showRightGradient && (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent" />
      )}
    </div>
  );
}
