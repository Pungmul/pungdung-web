import type { ProfileImage, User, UserProfileCardDetail } from "../../types";

function isUserShape(v: unknown): v is User {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.userId === "number" &&
    typeof o.username === "string" &&
    typeof o.name === "string" &&
    o.profileImage !== null &&
    typeof o.profileImage === "object"
  );
}

function parseProfileImage(v: unknown): ProfileImage | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (typeof o.fullFilePath !== "string") return null;
  return v as ProfileImage;
}

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
    const response = await fetch(`/api/users/info?${qs.toString()}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw Error("비정상 동작");
    const data: unknown = await response.json();
    if (!data || typeof data !== "object") return null;

    const row = flattenPayload(data as Record<string, unknown>);
    const profileImage =
      parseProfileImage(row.profileImage) ?? parseProfileImage(row.profile);

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
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchUserInfoByUsername(
  username: string
): Promise<User | null> {
  try {
    const qs = new URLSearchParams({ username });
    const response = await fetch(`/api/users/info?${qs.toString()}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw Error("비정상 동작");
    const data: unknown = await response.json();
    if (isUserShape(data)) return data;
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
