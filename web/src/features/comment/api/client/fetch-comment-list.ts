import {
  ClientApiError,
  clientApiRequest,
  ClientMapperError,
} from "@/core/api/client";

import { commentListResponseDtoSchema } from "./dto.schema";
import { mapCommentDtoToComment } from "../../lib";
import type { Comment } from "../../types";

/** 로그인한 사용자의 게시글 댓글 목록을 조회한다. */
export async function fetchCommentList(postId: number): Promise<Comment[]> {
  try {
    const dto = await clientApiRequest({
      url: `/api/comments?postId=${postId}`,
      responseSchema: commentListResponseDtoSchema,
    });

    return dto.map(mapCommentDtoToComment);
  } catch (error) {
    if (error instanceof ClientApiError) throw error;

    throw new ClientMapperError({
      message: "댓글 목록 응답을 앱 모델로 변환하는 데 실패했습니다.",
      context: "fetchCommentList",
      cause: error,
    });
  }
}
