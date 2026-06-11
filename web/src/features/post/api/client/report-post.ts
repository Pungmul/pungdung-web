import { clientApiRequest } from "@/core/api/client";

import { reportPostRequestBodySchema, reportPostResponseDtoSchema } from "./dto.schema";
import type { PostReportType } from "../../constants";

export interface ReportPostParams {
  postId: number;
  selectedOption: PostReportType;
}

export const reportPost = async ({
  postId,
  selectedOption,
}: ReportPostParams) =>
  clientApiRequest({
    url: `/api/posts/${postId}/report`,
    method: "POST",
    requestBodySchema: reportPostRequestBodySchema,
    body: { reportReason: selectedOption },
    responseSchema: reportPostResponseDtoSchema,
  });
