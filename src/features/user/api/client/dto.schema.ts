import { z } from "zod";

import type { User } from "../../types/user.types";

/** 업스트림 User/DTO와 완전 일치보다 런타임 안전성 우선 (`friends/api/client/dto.schema.ts`와 동일 계열) */
export const profileImageDtoSchema = z.looseObject({
  id: z.number(),
  originalFilename: z.string(),
  convertedFileName: z.string(),
  fullFilePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  createdAt: z.string(),
});

const userListRowSchema = z.looseObject({
  userId: z.number(),
  username: z.string(),
  name: z.string(),
  clubName: z.string().nullable().optional(),
  groupName: z.string().nullable().optional(),
  profileImage: profileImageDtoSchema.nullable().optional(),
  profile: profileImageDtoSchema.nullable().optional(),
});

/**
 * `/api/users`, `/api/users/info` 등에서 내려오는 단일 유저 레코드를 `User`로 정규화한다.
 * `profile`만 있고 `profileImage`가 비는 경우를 허용한다.
 */
export function parseUserFromUnknown(row: unknown): User | null {
  const parsed = userListRowSchema.safeParse(row);
  if (!parsed.success) return null;
  const profileImage = parsed.data.profileImage ?? parsed.data.profile;
  if (!profileImage) return null;
  const { clubName, groupName } = parsed.data;
  return {
    userId: parsed.data.userId,
    username: parsed.data.username,
    name: parsed.data.name,
    ...(clubName !== undefined ? { clubName } : {}),
    ...(groupName !== undefined ? { groupName } : {}),
    profileImage,
  };
}

/** 성공 시 envelope.response — `/api/users/info` 본문(객체 레코드) */
export const usersInfoResponseSchema = z.record(z.string(), z.unknown());

/** 성공 시 envelope.response — `/api/users?keyword=` (배열 또는 `{ users }`) */
export const usersKeywordListResponseSchema = z.union([
  z.array(z.unknown()),
  z.object({ users: z.array(z.unknown()) }),
]);
