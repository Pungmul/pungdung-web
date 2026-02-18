import { z } from "zod";

/** 에디터 multipart에 실리는 이미지 한 줄. */
export const postImageBlobEntrySchema = z.object({
  id: z.number().optional(),
  blob: z.instanceof(Blob),
  url: z.string().optional(),
});

export type PostImageBlobEntry = z.infer<typeof postImageBlobEntrySchema>;
