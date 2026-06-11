import { z } from "zod";

export const questionOptionSchema = z.object({
  label: z.string().trim().min(1, "선택지를 입력해주세요."),
  orderNo: z.number().int().nonnegative(),
});
