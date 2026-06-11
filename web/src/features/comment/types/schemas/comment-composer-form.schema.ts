import { z } from "zod";

import { createCommentRequestDtoSchema } from "../../api/client";

export const commentComposerFormSchema = createCommentRequestDtoSchema.extend({
  content: z.string().trim().min(1, "댓글을 입력해주세요."),
});

export type CommentComposerFormValues = z.infer<
  typeof commentComposerFormSchema
>;
