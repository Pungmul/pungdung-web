import { z } from "zod";

import { personalSchema } from "@/features/auth/types/schemas";

const baseSchema = personalSchema
  .omit({ club: true })
  .safeExtend({
    oldPassword: z.string({ message: "현재 비밀번호를 입력해주세요" }),
    club: personalSchema.shape.club,
    profileImage: z.string().optional(),
  })
  .partial();

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

const DEFAULT_CLUB_LABEL = "없음";

const toClubEnum = (clubNames: string[]) => {
  if (clubNames.length === 0) {
    return z.enum([DEFAULT_CLUB_LABEL] as [string, ...string[]]);
  }

  return z.enum(clubNames as [string, ...string[]]);
};

export const createEditProfileSchema = (clubNames?: string[]) => {
  if (!clubNames || clubNames.length === 0) {
    return baseEditProfileSchema;
  }

  const names = [...clubNames];
  if (!names.includes(DEFAULT_CLUB_LABEL)) {
    names.push(DEFAULT_CLUB_LABEL);
  }

  return personalSchema
    .omit({ club: true })
    .safeExtend({
      oldPassword: z.string({ message: "현재 비밀번호를 입력해주세요" }),
      club: toClubEnum(names).nullable().optional(),
      profileImage: z.string().optional(),
    })
    .partial()
    .refine(
      (data) => !data.nickname || /^[가-힣]+$/.test(data.nickname ?? ""),
      {
        message: "올바른 형식의 한글 패명을 입력하세요",
        path: ["nickname"],
      }
    )
    .refine((data) => data.club !== undefined, {
      message: "소속패를 선택해주세요",
      path: ["club"],
    });
};

export type EditProfileSchema = ReturnType<typeof createEditProfileSchema>;
