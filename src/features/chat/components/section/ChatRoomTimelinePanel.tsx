"use client";

import { useMemo } from "react";

import type { User } from "@/features/user";

import { Spinner } from "@/shared/components";

import { ChatSendForm } from "./ChatSendForm";
import { MessageList as ChatMessageList } from "./MessageList";
import { OlderMessagesLoader } from "./OlderMessagesLoader";
import { ScrollToLatestButton } from "./ScrollToLatestButton";
import { CHAT_ROOM_Z_INDEX } from "../../constants/ui.constants";
import { useSendMessageAction } from "../../hooks/actions";
import {
  useChatRoomFetchOlderPageTrigger,
  useChatRoomMessageSources,
  useChatRoomTimelineScroll,
  useEntryReadSignRuntime,
  useEntryReadSnapshot,
  useGatedReadSign,
  useHydrateReadReceiptStore,
  usePostEntryReadSign,
} from "../../hooks/state";
import {
  useChatRoomSocketMessages,
  useEntryNewMessagesDivider,
  useMessageList,
  useOutgoingMessageHandlers,
  usePendingMessages,
  usePendingSocketEchoRemoval,
  useResetPendingMessagesOnRoomChange,
} from "../../hooks/view-model";
import { useChatRoomMessageSubscription } from "../../socket";
import type { ReadSignFn } from "../../socket/read-sign.types";
import type { UserImageMap, UserNameMap } from "../../types";

type ChatRoomTimelinePanelProps = {
  roomId: string;
  myInfo?: { username: string };
  readSign: ReadSignFn;
  isConnected: boolean;
  userList: User[];
  userImageMap: UserImageMap;
  userNameMap: UserNameMap;
};

export function ChatRoomTimelinePanel({
  roomId,
  myInfo,
  readSign,
  isConnected,
  userList,
  userImageMap,
  userNameMap,
}: ChatRoomTimelinePanelProps) {
  // --- entry read-sign runtime ---
  const { coordRef: entryReadSignCoordRef, gate: entryReadSignGate } =
    useEntryReadSignRuntime(roomId);

  // --- socket subscription: room message topic readiness ---
  const { canSend } = useChatRoomMessageSubscription({ roomId, isConnected });

  // --- message sources: cache, room query, infinite pagination ---
  const {
    cachedMessages,
    entryUnreadCountHint,
    chatRoomData,
    infiniteData,
    isRoomInfoReadyForEntrySnapshot,
    isInfiniteLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatRoomMessageSources({
    roomId,
    username: myInfo?.username ?? "",
  });

  // --- participants: current user in room ---
  const currentUser = useMemo(() => {
    const username = myInfo?.username ?? "";
    return {
      username,
      userId: username
        ? (userList.find((user) => user.username === username)?.userId ?? null)
        : null,
    };
  }, [myInfo?.username, userList]);
  useHydrateReadReceiptStore({
    roomId,
    chatRoomData,
    currentUserId: currentUser.userId,
  });

  // --- pending queue: local send state & socket-echo cleanup ---
  const pending = usePendingMessages();
  useResetPendingMessagesOnRoomChange(pending.setPendingMessages, roomId);
  const removePendingOnSocketEcho = usePendingSocketEchoRemoval({
    setPendingMessages: pending.setPendingMessages,
    senderUsername: currentUser.username,
  });

  // --- send wiring: pending primitives → outgoing command handlers ---
  const outgoingMessageHandlers = useOutgoingMessageHandlers({
    roomId,
    senderUsername: currentUser.username,
    enqueueText: pending.enqueueText,
    enqueueImage: pending.enqueueImage,
    requeueTextFailedAtEnd: pending.requeueTextFailedAtEnd,
    requeueImageFailedAtEnd: pending.requeueImageFailedAtEnd,
    removeById: pending.removeById,
    failById: pending.failById,
  });

  // --- realtime socket buffer & render merge ---
  const socketMessages = useChatRoomSocketMessages({
    roomId,
    readSign,
    entryReadSignGate,
    onSocketEchoMessage: removePendingOnSocketEcho,
  });
  const messageList = useMessageList({
    cachedMessages,
    socketMessages: socketMessages.socketMessages,
    pendingMessages: pending.pendingMessages,
    ...(chatRoomData !== undefined ? { chatRoomData } : {}),
    ...(infiniteData !== undefined ? { infiniteData } : {}),
  });

  // --- entry unread: snapshot, post-entry readSign, gated send readSign ---
  const {
    entryLastReadMessageId,
    hadUnreadOnEntry,
    isEntrySnapshotCaptured,
  } = useEntryReadSnapshot(
    roomId,
    chatRoomData,
    currentUser.username || undefined,
    messageList,
    isRoomInfoReadyForEntrySnapshot,
    entryReadSignCoordRef,
    entryUnreadCountHint
  );
  usePostEntryReadSign({
    isEntrySnapshotCaptured,
    messageList,
    readSign,
    coordRef: entryReadSignCoordRef,
  });
  const gatedReadSign = useGatedReadSign({
    roomId,
    readSign,
    coordRef: entryReadSignCoordRef,
    gate: entryReadSignGate,
  });
  const newMessagesDividerIndex = useEntryNewMessagesDivider({
    messages: messageList,
    entryLastReadMessageId,
    hadUnreadOnEntry,
  });

  const blockMainArea =
    messageList.length === 0 && (isInfiniteLoading || !isConnected);

  const canAttemptEntryUnreadScroll =
    messageList.length > 0 &&
    !blockMainArea &&
    !isInfiniteLoading &&
    isEntrySnapshotCaptured;

  const {
    scrollContainerRef,
    sendFormContainerRef,
    messageContainerRef,
    saveScrollPosition,
    scrollToLatest,
    showScrollToLatestButton,
    sendFormBottomOffsetPx,
  } = useChatRoomTimelineScroll({
    roomId,
    messageList,
    hadUnreadOnEntry,
    hasNewMessagesDivider: newMessagesDividerIndex !== null,
    isEntrySnapshotCaptured,
    canAttemptEntryUnreadScroll,
  });

  // --- user actions: send, retry, load older messages ---
  const {
    onSendMessage,
    onSendImage,
    onRetryTextFailed,
    onRetryImageFailed,
  } = useSendMessageAction({
    roomId,
    readSign: gatedReadSign,
    outgoingMessageHandlers,
    canSend,
    onMessageSent: () => scrollToLatest("afterLayout"),
  });

  const { onTrigger } = useChatRoomFetchOlderPageTrigger({
    fetchNextPage,
    isFetchingNextPage,
    saveScrollPosition,
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* timeline scroll area */}
      <div
        ref={scrollContainerRef}
        className="
          flex min-h-0 flex-1 flex-col-reverse overflow-y-auto overscroll-contain
          [-webkit-overflow-scrolling:touch]
          [overflow-anchor:none]
        "
      >
        {blockMainArea ? (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-background">
            <Spinner size={36} />
          </div>
        ) : (
          <div
            ref={messageContainerRef}
            className="w-full flex flex-col shrink-0 grow-1 bg-background px-[16px] py-[24px]"
          >
            <OlderMessagesLoader
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onTrigger={onTrigger}
            />
            <ChatMessageList
              roomId={roomId}
              messages={messageList}
              currentUsername={currentUser.username}
              currentUserId={currentUser.userId}
              userList={userList}
              isGroup={chatRoomData?.chatRoomInfo.group ?? true}
              newMessagesDividerIndex={newMessagesDividerIndex}
              userImageMap={userImageMap}
              userNameMap={userNameMap}
              onRetryFailedText={onRetryTextFailed}
              onRetryFailedImage={onRetryImageFailed}
              onDeletePending={pending.dismiss}
            />
          </div>
        )}
      </div>

      {/* scroll-to-latest & send form */}
      <ScrollToLatestButton
        isVisible={showScrollToLatestButton}
        bottomPx={sendFormBottomOffsetPx}
        onClick={() => scrollToLatest("immediate")}
      />
      <div
        ref={sendFormContainerRef}
        className="relative shrink-0"
        style={{ zIndex: CHAT_ROOM_Z_INDEX.sendForm }}
      >
        <ChatSendForm
          canSend={canSend}
          onSendMessage={onSendMessage}
          onSendImage={onSendImage}
        />
      </div>
    </div>
  );
}
