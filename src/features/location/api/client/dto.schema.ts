import { z } from "zod";

export const locationPayloadSchema = z.object({
  username: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  timestamp: z.number().optional(),
});

/** GET /api/location — 본문이 없을 때 `null`, 있을 때 위치 페이로드 */
export const fetchUserLocationResponseSchema = locationPayloadSchema.nullable();

export type FetchUserLocationResponse = z.infer<
  typeof fetchUserLocationResponseSchema
>;

export const updateUserLocationRequestSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type UpdateUserLocationRequest = z.infer<
  typeof updateUserLocationRequestSchema
>;

export const voidResponseSchema = z.unknown().transform(() => undefined);
