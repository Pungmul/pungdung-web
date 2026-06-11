import { z } from "zod";

import { COMMENT_REPORT_TYPES } from "../../constants";

const reportReasonSelectableKeys = Object.keys(COMMENT_REPORT_TYPES) as [
  keyof typeof COMMENT_REPORT_TYPES,
  ...(keyof typeof COMMENT_REPORT_TYPES)[],
];

export const reportCommentFormSchema = z.object({
  reportReason: z.enum(reportReasonSelectableKeys),
});

export type ReportCommentFormValues = z.infer<typeof reportCommentFormSchema>;
