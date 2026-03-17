import { z } from "zod";

const optionalGroupNameSchema = z.preprocess(
  (val) => (val === null ? undefined : val),
  z.string().optional()
);

const optionalTrimmedString = z.preprocess(
  (val) => (val === null ? undefined : val),
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (val) => (val === null ? undefined : val),
  z.number().optional()
);

/**
 * BFF `GET /api/users/me`는 공통 envelope(`code`, `message`, `response`, `isSuccess`)를 검증한 뒤,
 * `response`에 아래 형태의 회원 객체가 온다고 가정한다.
 * 백엔드가 `null`을 줄 수 있는 필드는 `Member` 타입(undefined)과 맞게 정규화한다.
 */
export const profileImageDtoSchema = z.object({
  id: z.number(),
  originalFilename: z.string(),
  convertedFileName: z.string(),
  fullFilePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  createdAt: z.string(),
});

export const memberMeResponseSchema = z.object({
  loginId: optionalTrimmedString,
  name: z.string(),
  groupName: optionalGroupNameSchema,
  clubName: optionalTrimmedString,
  birth: optionalTrimmedString,
  clubAge: optionalNumber,
  phoneNumber: z.string(),
  email: z.string(),
  area: optionalTrimmedString,
  username: z.string(),
  profile: profileImageDtoSchema,
});

export type MemberMeDto = z.infer<typeof memberMeResponseSchema>;
