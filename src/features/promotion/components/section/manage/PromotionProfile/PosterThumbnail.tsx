"use client";

import Image from "next/image";

const posterImageShellClassName =
  "relative overflow-hidden rounded-[4px] border border-grey-200 bg-grey-200 flex items-center justify-center aspect-[2/3]";

interface PosterThumbnailProps {
  posterUrl: string | undefined;
  title: string | undefined;
  onClick: () => void;
  /** 가로: 부모가 높이 고정. 세로: 부모가 너비 채움. */
  layout: "horizontal" | "vertical";
}

export function PosterThumbnail({
  posterUrl,
  title,
  onClick,
  layout,
}: PosterThumbnailProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        isHorizontal
          ? "relative block h-full w-fit max-w-full shrink-0"
          : "relative block w-full"
      }
    >
      <div
        className={
          isHorizontal
            ? `${posterImageShellClassName} h-full w-auto max-h-full`
            : `${posterImageShellClassName} w-full`
        }
      >
        {posterUrl && (
          <Image
            src={posterUrl}
            alt={title || ""}
            fill
            className="object-cover object-center h-full"
          />
        )}
      </div>
    </button>
  );
}
