import { readReceiptAvatarUserIdsKey } from "../../../lib/message/read-receipt-avatar-key";
import type { MessageItemProps } from "../../../types/message-item.types";

export function areMessageItemPropsEqual(
  prev: MessageItemProps,
  next: MessageItemProps
): boolean {
  const prevState = "state" in prev.message ? prev.message.state : undefined;
  const nextState = "state" in next.message ? next.message.state : undefined;

  return (
    prev.message.id === next.message.id &&
    prevState === nextState &&
    prev.isGroupChat === next.isGroupChat &&
    prev.isDirectChat === next.isDirectChat &&
    prev.showDirectReadLabel === next.showDirectReadLabel &&
    readReceiptAvatarUserIdsKey(prev.readReceiptAvatars) ===
      readReceiptAvatarUserIdsKey(next.readReceiptAvatars) &&
    prev.onReadReceiptSlotClick === next.onReadReceiptSlotClick &&
    prev.onSenderProfileClick === next.onSenderProfileClick &&
    prev.userImageUrl === next.userImageUrl &&
    prev.senderDisplayName === next.senderDisplayName &&
    prev.currentUserId === next.currentUserId &&
    prev.prevMessage?.id === next.prevMessage?.id &&
    prev.nextMessage?.id === next.nextMessage?.id &&
    prev.prevMessage?.createdAt === next.prevMessage?.createdAt &&
    prev.nextMessage?.createdAt === next.nextMessage?.createdAt &&
    prev.onDateClick === next.onDateClick &&
    prev.onRetryFailedText === next.onRetryFailedText &&
    prev.onRetryFailedImage === next.onRetryFailedImage &&
    prev.onDeletePending === next.onDeletePending &&
    prev.dateRef === next.dateRef
  );
}
