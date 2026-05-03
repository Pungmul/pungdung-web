import type { User } from "@/features/user";

import type { ReadReceiptAvatar } from "../types/read-receipt.types";
import type { BuildReadReceiptAvatarsByMessageIdParams } from "../types/read-receipt-display.types";

export function toReadReceiptAvatar(user: User): ReadReceiptAvatar {
  return {
    userId: user.userId,
    username: user.username,
    imageUrl: user.profileImage?.fullFilePath || null,
    displayName: user.name,
  };
}

export function buildReadReceiptAvatarsByMessageId({
  userInitReadList,
  userList,
  currentUserId,
}: BuildReadReceiptAvatarsByMessageIdParams): Map<number, ReadReceiptAvatar[]> {
  const usersById = new Map(userList.map((user) => [user.userId, user]));
  const avatarsByMessageId = new Map<number, ReadReceiptAvatar[]>();

  for (const readState of userInitReadList) {
    const { userId, lastReadMessageId } = readState;

    if (userId === currentUserId || lastReadMessageId === null) {
      continue;
    }

    const user = usersById.get(userId);
    if (!user) {
      continue;
    }

    const avatars = avatarsByMessageId.get(lastReadMessageId) ?? [];
    avatars.push(toReadReceiptAvatar(user));
    avatarsByMessageId.set(lastReadMessageId, avatars);
  }

  for (const [messageId, avatars] of avatarsByMessageId) {
    avatarsByMessageId.set(
      messageId,
      [...avatars].sort((left, right) => left.userId - right.userId)
    );
  }

  return avatarsByMessageId;
}
