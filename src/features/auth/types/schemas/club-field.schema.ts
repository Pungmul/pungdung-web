import { z } from "zod";

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
