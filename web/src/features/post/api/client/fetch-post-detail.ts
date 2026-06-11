import {
  ClientApiError,
  clientApiRequest,
  ClientMapperError,
} from "@/core/api/client";

import { postDetailResponseDtoSchema } from "./dto.schema";
import { PostDeletedError } from "./post-deleted-error";
import { mapPostDetailDtoToArticle } from "../../lib/mappers/map-post-detail";
import { isDeletedPostDetailDto } from "../../services";
import type { PostArticleDetail } from "../../types/post-article-detail.types";

export async function fetchPostDetail(
  postId: number
): Promise<PostArticleDetail> {
  try {
    const dto = await clientApiRequest({
      url: `/api/posts/${postId}`,
      responseSchema: postDetailResponseDtoSchema,
    });
    if (isDeletedPostDetailDto(dto)) {
      throw new PostDeletedError(postId);
    }
    return mapPostDetailDtoToArticle(dto);
  } catch (error) {
    if (error instanceof ClientApiError) throw error;
    if (error instanceof PostDeletedError) throw error;
    throw new ClientMapperError({
      message: "응답을 앱 모델로 변환하는 데 실패했습니다.",
      context: "fetchPostDetail",
      cause: error,
    });
  }
}
