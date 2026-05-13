import {
  buildReadReceiptAvatarsByMessageId,
  toReadReceiptAvatar,
} from "./build-read-receipt-avatars-by-message-id.service";
import type { BuildReadReceiptAvatarsByMessageIdParams } from "../../types/read-receipt-display.types";
import type { ReadReceiptDisplayContext } from "../../types/read-receipt-display.types";

export function buildReadReceiptDisplayContext(
  params: BuildReadReceiptAvatarsByMessageIdParams
): ReadReceiptDisplayContext {
  if (!params.isGroup) {
    if (params.currentUserId === null) {
      return {
        mode: "direct",
        opponent: null,
        opponentLastReadMessageId: null,
      };
    }

    const opponentUser = params.userList.find(
      (user) => user.userId !== params.currentUserId
    );
    const opponentRead = params.userInitReadList.find(
      (readState) => readState.userId !== params.currentUserId
    );

    return {
      mode: "direct",
      opponent: opponentUser ? toReadReceiptAvatar(opponentUser) : null,
      opponentLastReadMessageId: opponentRead?.lastReadMessageId ?? null,
    };
  }

  return {
    mode: "group",
    avatarsByMessageId: buildReadReceiptAvatarsByMessageId(params),
  };
}
