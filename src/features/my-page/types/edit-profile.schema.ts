import { z } from "zod";

import {
  createClubFieldSchema,
  personalSchema,
} from "@/features/auth/types/schemas";

function buildEditProfilePartialSchema(clubIds: number[]) {
  return personalSchema
    .omit({ club: true })
    .safeExtend({
      oldPassword: z.string({ message: "현재 비밀번호를 입력해주세요" }),
      club: createClubFieldSchema(clubIds),
      profileImage: z.string().optional(),
    })
    .partial();
}

const baseSchema = buildEditProfilePartialSchema([]);

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

export const createEditProfileSchema = (clubIds?: number[]) => {
  const ids = clubIds ?? [];
  const hasDynamicClubList = ids.length > 0;

  return buildEditProfilePartialSchema(ids)
    .refine(
      (data) =>
        !hasDynamicClubList ||
        !data.nickname ||
        /^[가-힣]+$/.test(data.nickname ?? ""),
      {
        message: "올바른 형식의 한글 패명을 입력하세요",
        path: ["nickname"],
      }
    )
    .refine(
      (data) => !hasDynamicClubList || data.club !== undefined,
      {
        message: "소속패를 선택해주세요",
        path: ["club"],
      }
    );
};

export type EditProfileSchema = ReturnType<typeof createEditProfileSchema>;
