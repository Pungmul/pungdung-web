import { z } from "zod";

import { buildPersonalSchema } from "@/features/auth/types/schemas";

function buildEditProfilePartialSchema(clubIds: number[]) {
  return buildPersonalSchema(clubIds)
    .safeExtend({
      oldPassword: z.string({ message: "현재 비밀번호를 입력해주세요" }),
      profileImage: z.string().optional(),
    })
    .partial();
}

/** `EditProfileFormValues` 추론용 placeholder id — 실제 검증은 `createEditProfileSchema(clubIds)` */
const baseSchema = buildEditProfilePartialSchema([1]);

export const editProfilePasswordSchema = z.object({
  oldPassword: z
    .string({ message: "현재 비밀번호를 입력해주세요" })
    .min(1, "현재 비밀번호를 입력해주세요"),
});

export type EditProfileFormValues = z.infer<typeof baseSchema>;
export type EditProfilePasswordFormValues = z.infer<
  typeof editProfilePasswordSchema
>;

export const baseEditProfileSchema = baseSchema;

function isEditProfileNicknameValid(
  nickname: string | undefined,
  hasDynamicClubList: boolean
): boolean {
  return !hasDynamicClubList || !nickname || /^[가-힣]+$/.test(nickname);
}

function isEditProfileClubSelectedWhenLoaded(
  club: number | null | undefined,
  hasDynamicClubList: boolean
): boolean {
  return !hasDynamicClubList || club !== undefined;
}

export const createEditProfileSchema = (clubIds: number[]) => {
  const hasDynamicClubList = clubIds.length > 0;

  return buildEditProfilePartialSchema(clubIds)
    .refine(
      (data) => isEditProfileNicknameValid(data.nickname, hasDynamicClubList),
      {
        message: "올바른 형식의 한글 패명을 입력하세요",
        path: ["nickname"],
      }
    )
    .refine(
      (data) =>
        isEditProfileClubSelectedWhenLoaded(data.club, hasDynamicClubList),
      {
        message: "소속패를 선택해주세요",
        path: ["club"],
      }
    );
};

export type EditProfileSchema = ReturnType<typeof createEditProfileSchema>;
