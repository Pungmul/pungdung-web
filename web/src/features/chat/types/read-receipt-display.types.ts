import type { User } from "@/features/user";

import type { UserLastReadMessageId } from "./chat-room.types";
import type { ReadReceiptAvatar } from "./read-receipt.types";

export type BuildReadReceiptAvatarsByMessageIdParams = {
  userInitReadList: readonly UserLastReadMessageId[];
  userList: readonly User[];
  currentUserId: number | null;
  isGroup: boolean;
};

export type ReadReceiptDisplayContext =
  | {
      mode: "direct";
      opponent: ReadReceiptAvatar | null;
      opponentLastReadMessageId: number | null;
    }
  | {
      mode: "group";
      avatarsByMessageId: Map<number, ReadReceiptAvatar[]>;
    };

export type ShouldShowDirectReadLabelParams = {
  context: ReadReceiptDisplayContext;
  messageId: number;
  isMyMessage: boolean;
  isLatestMessageFromOpponent: boolean;
};
