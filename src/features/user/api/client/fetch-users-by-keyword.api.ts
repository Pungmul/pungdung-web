import type { User } from "../../types";

function normalizeUserList(payload: unknown): User[] {
  if (Array.isArray(payload)) {
    return payload as User[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "users" in payload &&
    Array.isArray((payload as { users: unknown }).users)
  ) {
    return (payload as { users: User[] }).users;
  }
  return [];
}

export async function fetchUsersByKeyword(keyword: string): Promise<User[]> {
  try {
    const qs = new URLSearchParams({ keyword });
    const response = await fetch(`/api/users?${qs.toString()}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw Error("비정상 동작");
    const data: unknown = await response.json();
    return normalizeUserList(data);
  } catch (e) {
    console.error(e);
    return [];
  }
}
