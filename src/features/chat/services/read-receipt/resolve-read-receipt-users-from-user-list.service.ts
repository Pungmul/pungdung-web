import type { User } from "@/features/user";

import type { ReadReceiptAvatar } from "../../types/read-receipt.types";

/** 읽음 아바타 순서를 유지한 채 `userList`에서 `User`를 찾는다. */
export function resolveReadReceiptUsersFromUserList(
  avatars: readonly ReadReceiptAvatar[],
  userList: readonly User[]
): User[] {
  const usersById = new Map(userList.map((user) => [user.userId, user]));

  return avatars
    .map((avatar) => usersById.get(avatar.userId))
    .filter((user): user is User => user !== undefined);
}
