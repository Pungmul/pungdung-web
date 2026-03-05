import { z } from "zod";

/** 가입·프로필 폼의 `club` 필드는 상위에서 `buildPersonalSchema(clubIds)`로 묶는 편이 일관적이다. */
export function createClubFieldSchema(dynamicClubIds: number[]) {
  const idSet = new Set(dynamicClubIds);

  return z
    .union([
      z
        .number()
        .int()
        .refine((id) => idSet.has(id)),
      z.null(),
    ])
    .optional();
}
