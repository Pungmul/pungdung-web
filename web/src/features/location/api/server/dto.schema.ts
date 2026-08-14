import { z } from "zod";

export const kakaoKeywordDocumentSchema = z.object({
  x: z.string(),
  y: z.string(),
  category_group_code: z.string().optional(),
});

export const kakaoKeywordSearchResponseSchema = z.object({
  documents: z.array(kakaoKeywordDocumentSchema).default([]),
});

export type KakaoKeywordSearchResponse = z.infer<
  typeof kakaoKeywordSearchResponseSchema
>;
