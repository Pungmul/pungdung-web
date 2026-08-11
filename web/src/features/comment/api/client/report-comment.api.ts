import { clientApiRequest } from "@/core/api/client";

import {
  commentMutationResponseDtoSchema,
  reportCommentRequestDtoSchema,
} from "./dto.schema";
import type { CommentReportType } from "../../constants";

export interface ReportCommentParams {
  commentId: number;
  selectedOption: CommentReportType;
}

export const reportComment = async ({
  commentId,
  selectedOption,
}: ReportCommentParams) => {
  const body = {
    reportReason: selectedOption,
  };

  return clientApiRequest({
    url: `/api/comments/${commentId}/report`,
    method: "POST",
    body,
    requestBodySchema: reportCommentRequestDtoSchema,
    responseSchema: commentMutationResponseDtoSchema,
  });
};
