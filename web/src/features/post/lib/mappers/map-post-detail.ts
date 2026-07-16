import type { PostDetailResponseDto } from "../../api/client/dto.schema";
import { imageObjectSchema } from "../../api/client/dto.schema";
import type { PostArticleDetail } from "../../types/post-article-detail.types";

import type { ImageObject } from "@/shared";

function mapImage(raw: unknown): ImageObject {
  return imageObjectSchema.parse(raw);
}

/** 검증된 상세 응답 DTO를 클라이언트 게시글 상세 모델로 변환한다. */
export function mapPostDetailDtoToArticle(
  dto: PostDetailResponseDto
): PostArticleDetail {
  const thumbnail =
    dto.thumbnail === undefined || dto.thumbnail === null
      ? null
      : mapImage(dto.thumbnail);
  const images = dto.imageList ?? [];
  const imageNum = dto.imageNum ?? images.length;

  return {
    postId: dto.postId,
    title: dto.title,
    content: dto.content,
    thumbnail,
    imageNum,
    viewCount: dto.viewCount ?? 0,
    likedNum: dto.likedNum ?? 0,
    commentNum: dto.commentNum,
    timeSincePosted: dto.timeSincePosted ?? 0,
    timeSincePostedText: dto.timeSincePostedText ?? "",
    // authorUsername은 식별 정보(또는 자유게시판 null). 표시/도메인 author로 쓰지 않는다.
    author: dto.author ?? "",
    imageList: images.map(mapImage),
    isLiked: dto.isLiked ?? false,
    isWriter: dto.isWriter ?? false,
    categoryId: dto.categoryId ?? 0,
  };
}
