import { z } from "zod";

import { CLUB_NAMES, clubListApi, NO_CLUB_VALUE } from "@/features/club";

import { AUTH_VALIDATION } from "../../constants";

const createClubEnum = (clubNames: string[]) => {
  if (clubNames.length === 0) {
    return z.enum(CLUB_NAMES as unknown as [string, ...string[]]);
  }
  return z.enum(clubNames as [string, ...string[]]);
};

const inviteCode = z
  .string()
  .min(1, AUTH_VALIDATION.PERSONAL.INVITE_CODE_REQUIRED)
  .regex(/^\d{6}$/, {
    message: AUTH_VALIDATION.PERSONAL.INVITE_CODE_DIGITS,
  });

const nameField = z
  .string()
  .min(1, AUTH_VALIDATION.PERSONAL.NAME_REQUIRED)
  .regex(/^[가-힣]+$/, { message: AUTH_VALIDATION.PERSONAL.NAME_KOREAN });

const clubAgeField = z
  .string()
  .regex(/^\d{2}$/, { message: AUTH_VALIDATION.PERSONAL.CLUB_AGE_TWO_DIGITS });

const tellNumberField = z
  .string()
  .min(1, AUTH_VALIDATION.PERSONAL.PHONE_REQUIRED)
  .regex(/^(01[0-9]-?\d{3,4}-?\d{4}|0\d{2,3}-?\d{3,4}-?\d{4})$/, {
    message: AUTH_VALIDATION.PERSONAL.PHONE_FORMAT,
  });

/** Select `소속패 없음` 값 — `transformSignUpData`에서 `"없음"`으로 정규화된다 */
const staticClubField = z
  .union([
    z.enum(CLUB_NAMES as unknown as [string, ...string[]]),
    z.literal(NO_CLUB_VALUE),
  ])
  .nullable()
  .optional();

/** refine 콜백에 넘기기 전용 — 실제 스키마 출력은 각 `z.object` 블록에서 추론된다. */
const isValidNickname = (nickname: string | undefined) =>
  !nickname || /^[가-힣]+$/.test(nickname);

const isClubSelected = (club: string | null | undefined) => club !== undefined;

const NICKNAME_REFINE = {
  message: AUTH_VALIDATION.PERSONAL.NICKNAME_KOREAN,
  path: ["nickname"] as PropertyKey[],
};

const CLUB_REFINE = {
  message: AUTH_VALIDATION.PERSONAL.CLUB_REQUIRED,
  path: ["club"] as PropertyKey[],
};

function appendPersonalRefines<
  S extends z.ZodObject<{
    name: z.ZodString;
    nickname: z.ZodOptional<z.ZodString>;
    club: z.ZodType<string | null | undefined>;
    clubAge: z.ZodString;
    tellNumber: z.ZodString;
    inviteCode: z.ZodType<string>;
  }>
>(schema: S) {
  return schema
    .refine((data) => isValidNickname(data.nickname), NICKNAME_REFINE)
    .refine((data) => isClubSelected(data.club), CLUB_REFINE);
}

function buildDynamicPersonalSchema(clubNames: string[]) {
  const base = z.object({
    name: nameField,
    nickname: z.string().optional(),
    club: createClubEnum(clubNames).nullable().optional(),
    clubAge: clubAgeField,
    tellNumber: tellNumberField,
    inviteCode,
  });
  return appendPersonalRefines(base);
}

async function loadClubNames(
  fetchClubs: () => Promise<Array<{ groupName: string }>>
): Promise<string[]> {
  try {
    const clubList = await fetchClubs();
    const clubNames = clubList.map((c) => c.groupName);
    if (!clubNames.includes("없음")) {
      clubNames.push("없음");
    }
    return clubNames;
  } catch (error) {
    console.error("Failed to fetch club list, using default", error);
    return CLUB_NAMES as unknown as string[];
  }
}

/** 클럽 목록을 불러와 enum을 맞춘 뒤 개인정보 스키마를 만든다. */
export async function createDynamicPersonalSchema() {
  const clubNames = await loadClubNames(clubListApi);
  return buildDynamicPersonalSchema(clubNames);
}

const basePersonalSchema = z.object({
  name: nameField,
  nickname: z.string().optional(),
  club: staticClubField,
  clubAge: clubAgeField,
  tellNumber: tellNumberField,
  inviteCode,
});

/** 가입 개인정보 공통 스키마 — 클럽 목록 동적 주입 전 fallback */
export const personalSchema = appendPersonalRefines(basePersonalSchema);

/** 레거시 alias: 점진적 마이그레이션 호환 */
export const emailPersonalSchema = personalSchema;
export const kakaoPersonalSchema = personalSchema;

export type PersonalFormData = z.infer<typeof personalSchema>;
export type EmailPersonalFormData = PersonalFormData;
export type KakaoPersonalFormData = PersonalFormData;
