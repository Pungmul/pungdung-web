import type { MessageItemLayoutContext } from "../../../lib/message/message-item-layout.types";
import type { Message, PendingMessage } from "../../../types";
import type { ReadReceiptAvatar } from "../../../types/read-receipt.types";

export type { MessageItemLayoutContext };

export interface MessageItemProps {
  message: Message | PendingMessage;
  prevMessage: (Message | PendingMessage) | undefined;
  nextMessage: (Message | PendingMessage) | undefined;
  currentUserId: string;
  isGroupChat: boolean;
  isDirectChat: boolean;
  showDirectReadLabel: boolean;
  readReceiptAvatars: readonly ReadReceiptAvatar[];
  onReadReceiptSlotClick?: () => void;
  onSenderProfileClick?: () => void;
  userImageUrl: string | null;
  senderDisplayName: string;
  onDateClick: (dateKey: string) => void;
  dateRef: ((el: HTMLLIElement | null) => void) | undefined;
  onRetryFailedText: (failed: PendingMessage) => void;
  onRetryFailedImage: (failed: PendingMessage) => void;
  onDeletePending: (message: PendingMessage) => void;
}
