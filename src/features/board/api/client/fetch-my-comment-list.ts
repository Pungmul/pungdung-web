import { clientApiRequest, withResponseMapper } from "@/core/api/client";

import { mapMyCommentListPageDtoToResponse } from "@/features/comment";

import { myCommentListPageDtoSchema } from "@/features/comment/api/client";

export const fetchMyCommentList = (pageParam: number, size = 10) =>
  withResponseMapper({
    context: "fetchMyCommentList",
    fetchDto: () =>
      clientApiRequest({
        url: `${
          process.env.NEXT_PUBLIC_LOCAL_URL
        }/api/comments/me?page=${String(pageParam)}&size=${String(size)}`,
        responseSchema: myCommentListPageDtoSchema,
      }),
    map: mapMyCommentListPageDtoToResponse,
  });
