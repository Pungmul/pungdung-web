import {
  clientApiMultipartUploadRequest,
  type ClientApiUploadProgressEvent,
} from "@/core/api/client";

import { createPostResponseDtoSchema } from "./dto.schema";

export interface CreatePostParams {
  boardId: number;
  formData: FormData;
  onUploadProgress?: (evt: ClientApiUploadProgressEvent) => void;
  onUploadFinished?: () => void;
}

export const createPost = async ({
  boardId,
  formData,
  onUploadProgress,
  onUploadFinished,
}: CreatePostParams) =>
  clientApiMultipartUploadRequest({
    url: `/api/posts?boardId=${boardId}`,
    method: "POST",
    formData,
    responseSchema: createPostResponseDtoSchema,
    ...(onUploadProgress ? { onUploadProgress } : {}),
    ...(onUploadFinished ? { onUploadFinished } : {}),
  });
