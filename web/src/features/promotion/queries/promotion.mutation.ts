import { mutationOptions } from "@tanstack/react-query";

import {
  cancelPromotionResponse,
  requestCreatePromotion,
  savePromotionForm,
  searchPromotionAddress,
} from "../api/client";
import type { PromotionFormSavePayload } from "../types";

export const promotionMutationOptions = {
  cancelResponse: () =>
    mutationOptions({
      mutationKey: ["promotion", "cancelResponse"] as const,
      mutationFn: cancelPromotionResponse,
    }),

  createPromotion: () =>
    mutationOptions({
      mutationKey: ["promotion", "create"] as const,
      mutationFn: requestCreatePromotion,
    }),

  saveForm: () =>
    mutationOptions({
      mutationKey: ["promotion", "saveForm"] as const,
      mutationFn: ({
        formId,
        form,
      }: {
        formId: number;
        form: PromotionFormSavePayload;
      }) => savePromotionForm(formId, form),
    }),

  searchAddress: () =>
    mutationOptions({
      mutationKey: ["promotion", "searchAddress"] as const,
      mutationFn: searchPromotionAddress,
    }),
};
