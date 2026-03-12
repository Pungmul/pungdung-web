import { z } from "zod";

/** 업스트림 User/DTO와 완전 일치보다 런타임 안전성 우선 */
export const profileImageDtoSchema = z.looseObject({
  id: z.number(),
  originalFilename: z.string(),
  convertedFileName: z.string(),
  fullFilePath: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  createdAt: z.string(),
});

export const userDtoSchema = z.looseObject({
  userId: z.number(),
  username: z.string(),
  name: z.string(),
  clubName: z.string().nullable().optional(),
  profileImage: profileImageDtoSchema,
});

export const friendRequestInfoDtoSchema = z.looseObject({
  friendRequestId: z.number().nullable(),
  friendStatus: z.string(),
});

export const friendDtoSchema = z.looseObject({
  friendRequestId: z.number(),
  friendStatus: z.string(),
  simpleUserDTO: userDtoSchema,
  /** 수락된 친구 등에서 null 로 오는 경우가 있음 */
  isRequestSentByUser: z.boolean().nullable().optional(),
});

export type FriendLoadDtoRow = z.infer<typeof friendDtoSchema>;

export const friendStatusItemDtoSchema = z.looseObject({
  user: userDtoSchema,
  friendRequestInfo: friendRequestInfoDtoSchema,
});

export const friendsSearchResponseSchema = z.array(friendStatusItemDtoSchema);

export const friendsLoadResponseSchema = z.looseObject({
  acceptedFriendList: z.array(friendDtoSchema),
  pendingReceivedList: z.array(friendDtoSchema),
  pendingSentList: z.array(friendDtoSchema),
});

/** 성공 시 envelope.response — 업스트림이 null·객체 등 혼재할 수 있음 */
export const friendMutationVoidResponseSchema = z
  .unknown()
  .transform(() => undefined);
