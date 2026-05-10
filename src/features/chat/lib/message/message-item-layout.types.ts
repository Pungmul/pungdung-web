export interface MessageItemLayoutContext {
  isUser: boolean;
  timeStamp: string;
  isSameTimeBefore: boolean;
  isSameTimeAfter: boolean;
  isSameDate: boolean;
  dateKey: string;
  displayDate: string;
  showDirectReadSlot: boolean;
  showTimestamp: boolean;
  hasSideContent: boolean;
  readReceiptAlign: "left" | "right";
  hasGroupReadReceipts: boolean;
  senderProfileClickHandler: (() => void) | undefined;
}
