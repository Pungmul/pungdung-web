import { z } from "zod";

import { clubListApi } from "@/features/club";

import { createClubFieldSchema } from "./club-field.schema";
import { AUTH_VALIDATION } from "../../constants";

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

/** refine 콜백에 넘기기 전용 — 실제 스키마 출력은 각 `z.object` 블록에서 추론된다. */
const isValidNickname = (nickname: string | undefined) =>
  !nickname || /^[가-힣]+$/.test(nickname);

/** `undefined`만 미선택. `null`은 소속 없음 명시 선택, 숫자는 클럽 선택. */
const isClubSelected = (club: number | null | undefined) => club !== undefined;

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
    club: z.ZodType<number | null | undefined>;
    clubAge: z.ZodString;
    tellNumber: z.ZodString;
    inviteCode: z.ZodType<string>;
  }>
>(schema: S) {
  return schema
    .refine((data) => isValidNickname(data.nickname), NICKNAME_REFINE)
    .refine((data) => isClubSelected(data.club), CLUB_REFINE);
}

/** `clubIds`는 API `clubList`의 `clubId` 목록과 동일하게 맞춘다. */
export function buildPersonalSchema(clubIds: number[]) {
  const base = z.object({
    name: nameField,
    nickname: z.string().optional(),
    club: createClubFieldSchema(clubIds),
    clubAge: clubAgeField,
    tellNumber: tellNumberField,
    inviteCode,
  });
  return appendPersonalRefines(base);
}

async function loadClubIds(
  fetchClubs: () => Promise<Array<{ clubId: number }>>
): Promise<number[]> {
  try {
    const clubList = await fetchClubs();
    return clubList.map((c) => c.clubId);
  } catch (error) {
    console.error("Failed to fetch club list", error);
    return [];
  }
}

/** 클럽 목록을 불러와 id enum을 맞춘 뒤 개인정보 스키마를 만든다. */
export async function createDynamicPersonalSchema() {
  const clubIds = await loadClubIds(clubListApi);
  return buildPersonalSchema(clubIds);
}

export type PersonalFormData = z.infer<ReturnType<typeof buildPersonalSchema>>;
export type EmailPersonalFormData = PersonalFormData;
export type KakaoPersonalFormData = PersonalFormData;
