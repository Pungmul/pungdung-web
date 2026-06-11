import type { ImageObject } from "@/shared/types/image";

import {
  commentDtoSchema,
  commentImageObjectDtoSchema,
} from "../../api/client/dto.schema";
import type { Comment } from "../../types";

function mapCommentProfile(raw: unknown): ImageObject {
  return commentImageObjectDtoSchema.parse(raw);
}

const EMPTY_COMMENT_PROFILE: ImageObject = {
  id: 0,
  originalFilename: "",
  convertedFileName: "",
  fullFilePath: "",
  fileType: "",
  fileSize: 0,
  createdAt: "",
};

export function mapCommentDtoToComment(raw: unknown): Comment {
  const dto = commentDtoSchema.parse(raw) as {
    commentId: number;
    postId: number;
    parentId: number | null;
    content: string;
    userName: string | null;
    profile?: unknown | null;
    createdAt: string;
    replies?: unknown[] | null;
  };

  return {
    commentId: dto.commentId,
    postId: dto.postId,
    parentId: dto.parentId,
    content: dto.content,
    userName: dto.userName ?? "탈퇴한 회원",
    profile:
      dto.profile !== undefined && dto.profile !== null
        ? mapCommentProfile(dto.profile)
        : EMPTY_COMMENT_PROFILE,
    createdAt: dto.createdAt,
    replies: (dto.replies ?? []).map(mapCommentDtoToComment),
  };
}
