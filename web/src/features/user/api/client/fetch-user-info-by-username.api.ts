import { clientApiRequest } from "@/core/api/client";

import {
  parseUserFromUnknown,
  profileImageDtoSchema,
  usersInfoResponseSchema,
} from "./dto.schema";
import type { UserProfileCardDetail } from "../../types";
import type { User } from "../../types";

function optionalString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v : undefined;
}

function optionalNumber(v: unknown): number | undefined {
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
}

/** `clubInfo`에만 있는 필드와 상단 필드를 한 레코드로 합친다. 상단 값이 우선한다. */
function flattenPayload(o: Record<string, unknown>): Record<string, unknown> {
  const club =
    o.clubInfo && typeof o.clubInfo === "object"
      ? (o.clubInfo as Record<string, unknown>)
      : {};
  return { ...club, ...o };
}

/**
 * 프로필 카드 보조 정보: 이미지·동호회·학교·이메일 등.
 * 레이아웃상 표시 이름은 `User.name`(목록/소켓에서 온 값)을 쓴다.
 */
export async function fetchUserProfileCardDetailByUsername(
  username: string
): Promise<UserProfileCardDetail | null> {
  try {
    const qs = new URLSearchParams({ username });
    const data = await clientApiRequest({
      url: `/api/users/info?${qs.toString()}`,
      responseSchema: usersInfoResponseSchema,
    });

    const row = flattenPayload(data);
    const rawImg = row.profileImage ?? row.profile;
    const parsedImg = profileImageDtoSchema.safeParse(rawImg);
    const profileImage = parsedImg.success ? parsedImg.data : null;

    const clubName = optionalString(row.clubName);
    const school = optionalString(row.school);
    const groupName = optionalString(row.groupName);
    const clubAge = optionalNumber(row.clubAge);
    const email = optionalString(row.email) ?? optionalString(row.loginId);

    return {
      profileImage,
      ...(clubName ? { clubName } : {}),
      ...(school ? { school } : {}),
      ...(groupName ? { groupName } : {}),
      ...(clubAge != null ? { clubAge } : {}),
      ...(email ? { email } : {}),
    };
  } catch {
    return null;
  }
}

export async function fetchUserInfoByUsername(
  username: string
): Promise<User | null> {
  try {
    const qs = new URLSearchParams({ username });
    const data = await clientApiRequest({
      url: `/api/users/info?${qs.toString()}`,
      responseSchema: usersInfoResponseSchema,
    });

    const direct = parseUserFromUnknown(data);
    if (direct) return direct;

    if (!data || typeof data !== "object") return null;
    return parseUserFromUnknown(
      flattenPayload(data as Record<string, unknown>)
    );
  } catch {
    return null;
  }
}
