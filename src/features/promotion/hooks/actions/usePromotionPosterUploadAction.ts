"use client";

import { useCallback, useState } from "react";

import { Alert } from "@/shared";

import { uploadPromotionImageToS3 } from "../../api/client";
import {
  PROMOTION_POSTER_IMAGE_ACCEPT,
  validatePromotionPosterFileBeforeUpload,
} from "../../lib/promotion-poster-file";
import type { PromotionPostingPosterValue } from "../../types/promotion-posting-form.types";

export function usePromotionPosterUploadAction(formId: string | null) {
  const [isUploadPending, setUploadPending] = useState(false);

  const handlePosterFileInputChange = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      onUploaded: (value: PromotionPostingPosterValue) => void
    ) => {
      if (!formId) return;
      const file = event.target.files?.[0];
      const inputElement = event.currentTarget;
      if (!file) return;

      const validation = validatePromotionPosterFileBeforeUpload(file);
      if (!validation.ok) {
        Alert.alert({
          title: validation.title,
          message: validation.message,
        });
        inputElement.value = "";
        return;
      }

      setUploadPending(true);
      try {
        const uploadedPosterImages = await uploadPromotionImageToS3(
          Number(formId),
          file
        );
        const primaryPosterImage = uploadedPosterImages[0];
        if (primaryPosterImage) {
          onUploaded({
            id: primaryPosterImage.id,
            imageUrl: primaryPosterImage.imageUrl,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "포스터 업로드에 실패했습니다.";
        Alert.alert({
          title: "포스터 업로드 실패",
          message: errorMessage,
        });
      } finally {
        setUploadPending(false);
        inputElement.value = "";
      }
    },
    [formId]
  );

  return {
    isUploadPending,
    handlePosterFileInputChange,
    posterInputAccept: PROMOTION_POSTER_IMAGE_ACCEPT,
  };
}
