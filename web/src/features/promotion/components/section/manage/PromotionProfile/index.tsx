"use client";

import { useState } from "react";

import { Responsive } from "@/shared";
import { ImageViewer } from "@/shared/components/ui";
import type { Address } from "@/shared/types";

import { PromotionProfileHorizontal } from "./PromotionProfileHorizontal";
import { PromotionProfileVertical } from "./PromotionProfileVertical";

export interface PromotionProfileProps {
  posterUrl?: string;
  title?: string;
  address?: Address | null;
  startAt?: string;
}

export const PromotionProfile = (profileProps: PromotionProfileProps) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const imageList = profileProps.posterUrl ? [profileProps.posterUrl] : [];

  return (
    <>
      <ImageViewer
        isOpen={isImageViewerOpen}
        images={imageList}
        onClose={() => setIsImageViewerOpen(false)}
      />
      <Responsive
        mobile={
          <PromotionProfileVertical
            {...profileProps}
            onPosterClick={() => {
              if (!profileProps.posterUrl) return;
              setIsImageViewerOpen(true);
            }}
          />
        }
        desktop={
          <PromotionProfileHorizontal
            {...profileProps}
            onPosterClick={() => {
              if (!profileProps.posterUrl) return;
              setIsImageViewerOpen(true);
            }}
          />
        }
      />
    </>
  );
};
