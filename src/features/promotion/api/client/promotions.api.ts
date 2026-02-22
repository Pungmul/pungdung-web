import { z } from "zod";

import { clientApiMultipartUploadRequest, clientApiRequest } from "@/core/api/client";

import {
  createPromotionResponseSchema,
  formDetailDtoSchema,
  formSaveResponseSchema,
  myPromotionFormListResponseSchema,
  promotionDetailSchema,
  promotionPerformanceListResponseSchema,
  promotionResponseDetailDtoSchema,
  promotionResponseDtoSchema,
  responseDtoSchema,
  submitSurveyResponseSchema,
  uploadPromotionImageResponseSchema,
} from "./dto.schema";
import {
  mapPromotionApplicationDetailWireToClient,
  mapPromotionBookingRowWireToClient,
  mapPromotionDetailWireToClient,
  mapPromotionFormDraftWireToClient,
  mapPromotionFormListItemWireToClient,
  mapPromotionFormSaveAckWireToClient,
  mapPromotionFormSavePayloadToWire,
  mapPromotionListItemWireToClient,
  mapPromotionSurveySubmitAnswersToWire,
} from "../../lib/mappers";
import type { Promotion, PromotionDetail } from "../../types/promotion.types";
import type {
  PromotionFormListItem,
  PromotionFormSavePayload,
} from "../../types/promotion-form.types";
import type {
  PromotionApplicationDetail,
  PromotionBookingSummary,
  PromotionSurveySubmitAnswer,
} from "../../types/promotion-response.types";

const promotionResponseListSchema = z.array(promotionResponseDtoSchema);

export async function fetchPromotionList(): Promise<Promotion[]> {
  const { performanceList } = await clientApiRequest({
    url: "/api/promotions/list",
    responseSchema: promotionPerformanceListResponseSchema,
  });
  return performanceList.map(mapPromotionListItemWireToClient);
}

export async function fetchPromotionDetail(
  publicId: string
): Promise<PromotionDetail> {
  const wire = await clientApiRequest({
    url: `/api/promotions/detail/${publicId}`,
    responseSchema: promotionDetailSchema,
  });
  return mapPromotionDetailWireToClient(wire);
}

export async function fetchUpcomingPerformanceList(): Promise<
  PromotionBookingSummary[]
> {
  const wireList = await clientApiRequest({
    url: "/api/promotions/responses/me",
    responseSchema: promotionResponseListSchema,
  });
  return wireList.map(mapPromotionBookingRowWireToClient);
}

export async function fetchPromotionResponseDetail(
  responseId: string
): Promise<PromotionApplicationDetail> {
  const wire = await clientApiRequest({
    url: `/api/promotions/responses/${responseId}`,
    responseSchema: promotionResponseDetailDtoSchema,
  });
  return mapPromotionApplicationDetailWireToClient(wire);
}

export async function cancelPromotionResponse(responseId: string) {
  const wire = await clientApiRequest({
    url: `/api/promotions/responses/${responseId}`,
    method: "DELETE",
    responseSchema: promotionResponseDetailDtoSchema,
  });
  return mapPromotionApplicationDetailWireToClient(wire);
}

export async function requestCreatePromotion(): Promise<number> {
  const { formId } = await clientApiRequest({
    url: "/api/promotions/create",
    method: "POST",
    responseSchema: createPromotionResponseSchema,
  });
  return formId;
}

export async function fetchMyPromotionFormList(): Promise<
  PromotionFormListItem[]
> {
  const { formList } = await clientApiRequest({
    url: "/api/promotions/forms/me",
    responseSchema: myPromotionFormListResponseSchema,
  });
  return formList.map(mapPromotionFormListItemWireToClient);
}

export async function fetchPromotionFormDraft(formId: number) {
  const wire = await clientApiRequest({
    url: `/api/promotions/forms/${formId}`,
    responseSchema: formDetailDtoSchema,
  });
  return mapPromotionFormDraftWireToClient(wire);
}

export async function savePromotionForm(
  formId: number,
  form: PromotionFormSavePayload
) {
  const wire = await clientApiRequest({
    url: `/api/promotions/forms/${formId}/save`,
    method: "POST",
    body: mapPromotionFormSavePayloadToWire(form),
    responseSchema: formSaveResponseSchema,
  });
  return mapPromotionFormSaveAckWireToClient(wire);
}

export async function fetchPromotionFormResponses(formId: number) {
  const wireList = await clientApiRequest({
    url: `/api/promotions/forms/${formId}/manage`,
    responseSchema: z.array(responseDtoSchema),
  });
  return wireList.map(mapPromotionApplicationDetailWireToClient);
}

export async function publishPromotionForm(
  formId: number,
  expectedVersion: number
) {
  return clientApiRequest({
    url: `/api/promotions/forms/${formId}/submit`,
    method: "POST",
    body: { expectedVersion },
    responseSchema: z.unknown(),
  });
}

export async function submitPromotionSurvey(
  publicId: string,
  answers: PromotionSurveySubmitAnswer[]
) {
  return clientApiRequest({
    url: `/api/promotions/submit/${publicId}`,
    method: "POST",
    body: mapPromotionSurveySubmitAnswersToWire(answers),
    responseSchema: submitSurveyResponseSchema,
  });
}

export async function uploadPromotionImageToS3(formId: number, blob: Blob) {
  const formData = new FormData();
  formData.append("files", blob);

  const { performanceImageList } = await clientApiMultipartUploadRequest({
    url: `/api/promotions/forms/${formId}/uploadImage`,
    method: "POST",
    formData,
    responseSchema: uploadPromotionImageResponseSchema,
  });

  if (performanceImageList.length === 0) {
    throw new Error("Failed to upload image");
  }

  return performanceImageList;
}
