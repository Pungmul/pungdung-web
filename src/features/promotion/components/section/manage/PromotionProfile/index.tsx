"use client";

import { useState } from "react";

import { Responsive } from "@/shared";
import { ImageModal } from "@/shared/components/ui";
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const imageList = profileProps.posterUrl ? [profileProps.posterUrl] : [];

  return (
    <>
      <ImageModal
        isOpen={isImageModalOpen}
        images={imageList}
        onClose={() => setIsImageModalOpen(false)}
      />
      <Responsive
        mobile={
          <PromotionProfileVertical
            {...profileProps}
            onPosterClick={() => {
              if (!profileProps.posterUrl) return;
              setIsImageModalOpen(true);
            }}
          />
        }
        desktop={
          <PromotionProfileHorizontal
            {...profileProps}
            onPosterClick={() => {
              if (!profileProps.posterUrl) return;
              setIsImageModalOpen(true);
            }}
          />
        }
      />
    </>
  );
};
