import { clientApiRequest } from "@/core/api/client";

import { uploadPromotionImageResponseSchema } from "./dto.schema";

export async function uploadPromotionImageToS3(formId: number, blob: Blob) {
  const formData = new FormData();
  formData.append("files", blob);

  const { performanceImageList } = await clientApiRequest({
    url: `/api/promotions/forms/${formId}/uploadImage`,
    method: "POST",
    body: formData,
    responseSchema: uploadPromotionImageResponseSchema,
  });

  if (performanceImageList.length === 0) {
    throw new Error("Failed to upload image");
  }

  return performanceImageList;
}
