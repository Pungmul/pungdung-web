import { z } from "zod";

import { postImageBlobEntrySchema } from "./post-image-blob-entry.schema";
import {
  POST_EDITOR_MAX_IMAGE_COUNT,
  POST_EDITOR_MAX_SINGLE_IMAGE_BYTES,
} from "../../constants";

export const postEditorFormValuesSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    imageFiles: z.array(postImageBlobEntrySchema),
    anonymity: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.imageFiles.length > POST_EDITOR_MAX_IMAGE_COUNT) {
      ctx.addIssue({
        code: "custom",
        message: `이미지는 최대 ${POST_EDITOR_MAX_IMAGE_COUNT}장까지 첨부할 수 있어요.`,
        path: ["imageFiles"],
      });
    }
    data.imageFiles.forEach((file, index) => {
      if (file.id === -1 && file.blob.size > POST_EDITOR_MAX_SINGLE_IMAGE_BYTES) {
        ctx.addIssue({
          code: "custom",
          message: `각 이미지는 ${POST_EDITOR_MAX_SINGLE_IMAGE_BYTES / (1024 * 1024)}MB 이하여야 해요.`,
          path: ["imageFiles", index],
        });
      }
    });
  });

export type PostEditorFormValues = z.infer<typeof postEditorFormValuesSchema>;

export const emptyPostEditorFormValues: PostEditorFormValues = {
  title: "",
  content: "",
  imageFiles: [],
  anonymity: true,
};
