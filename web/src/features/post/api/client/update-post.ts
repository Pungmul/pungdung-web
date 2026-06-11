import {
  clientApiMultipartUploadRequest,
  type ClientApiUploadProgressEvent,
} from "@/core/api/client";

import { updatePostResponseDtoSchema } from "./dto.schema";

export interface UpdatePostParams {
  postId: number;
  formData: FormData;
  onUploadProgress?: (evt: ClientApiUploadProgressEvent) => void;
  onUploadFinished?: () => void;
}

export const updatePost = async ({
  postId,
  formData,
  onUploadProgress,
  onUploadFinished,
}: UpdatePostParams) =>
  clientApiMultipartUploadRequest({
    url: `/api/posts/${postId}`,
    method: "PATCH",
    formData,
    responseSchema: updatePostResponseDtoSchema,
    ...(onUploadProgress ? { onUploadProgress } : {}),
    ...(onUploadFinished ? { onUploadFinished } : {}),
  });
