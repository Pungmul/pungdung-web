"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";

import type { User } from "@/features/user";

import getScrollableParent from "@/shared/lib/getScrollableParent";

import { MessageListItem } from "./MessageListItem";
import {
  MESSAGE_LIST_DATE_ITEM_HEIGHT_PX,
  MESSAGE_LIST_DATE_JUMP_SMOOTH_SCROLL_MAX_DISTANCE_DOWN_PX,
  MESSAGE_LIST_DATE_JUMP_SMOOTH_SCROLL_MAX_DISTANCE_UP_PX,
  MESSAGE_LIST_GAP_PX,
  MESSAGE_LIST_HEADER_HEIGHT_PX,
} from "../../constants/ui.constants";
import { useChatMemberProfileClick } from "../../hooks/actions";
import {
  buildReadReceiptDisplayContext,
  getReadReceiptAvatarsForMessage,
  resolveReadReceiptUsersFromUserList,
  snapshotToUserInitReadList,
} from "../../services";
import {
  EMPTY_OTHER_PARTICIPANT_READ_SNAPSHOT,
  useReadReceiptStore,
} from "../../store";
import type { Message, PendingMessage } from "../../types";
import { ReadReceiptReadersModal } from "../overlay/ReadReceiptReadersModal";
import { NewMessagesDivider } from "../ui/NewMessagesDivider";

interface UserImageMap {
  [key: string]: string | null;
}

interface UserNameMap {
  [key: string]: string | null;
}

interface MessageListProps {
  roomId: string;
  messages: (Message | PendingMessage)[];
  currentUsername: string;
  currentUserId: number | null;
  userList: readonly User[];
  isGroup: boolean;
  newMessagesDividerIndex: number | null;
  userImageMap: UserImageMap;
  userNameMap: UserNameMap;
  onRetryFailedText: (failed: PendingMessage) => void;
  onRetryFailedImage: (failed: PendingMessage) => void;
  onDeletePending: (message: PendingMessage) => void;
}

const MessageListComponent: React.FC<MessageListProps> = ({
  roomId,
  messages,
  currentUsername,
  currentUserId,
  userList,
  isGroup,
  newMessagesDividerIndex,
  userImageMap,
  userNameMap,
  onRetryFailedText,
  onRetryFailedImage,
  onDeletePending,
}) => {
  const dateRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());
  const [readReceiptModalReaders, setReadReceiptModalReaders] = useState<
    User[] | null
  >(null);
  const { openChatMemberProfile } = useChatMemberProfileClick();

  const isLatestMessageFromOpponent = useMemo(() => {
    const latestMessage = messages.at(-1);
    return (
      latestMessage !== undefined &&
      latestMessage.senderUsername !== currentUsername
    );
  }, [messages, currentUsername]);

  const userByUsername = useMemo(
    () => new Map(userList.map((user) => [user.username, user])),
    [userList]
  );
  const roomSnapshot = useReadReceiptStore(
    (state) => state.byRoomId[roomId] ?? EMPTY_OTHER_PARTICIPANT_READ_SNAPSHOT
  );
  const readReceiptDisplayContext = useMemo(
    () =>
      buildReadReceiptDisplayContext({
        userInitReadList: snapshotToUserInitReadList(roomSnapshot),
        userList,
        currentUserId,
        isGroup,
      }),
    [currentUserId, isGroup, roomSnapshot, userList]
  );
  const senderUsernameByMessageId = useMemo(
    () =>
      new Map(
        messages
          .filter((message) => typeof message.id === "number")
          .map((message) => [message.id, message.senderUsername])
      ),
    [messages]
  );

  const handleDateClick = useCallback((dateKey: string) => {
    const targetElement = dateRefs.current.get(dateKey);
    if (targetElement) {
      const scrollableParent = getScrollableParent(targetElement);
      if (scrollableParent) {
        const targetTop =
          targetElement.offsetTop -
          MESSAGE_LIST_HEADER_HEIGHT_PX -
          MESSAGE_LIST_DATE_ITEM_HEIGHT_PX -
          MESSAGE_LIST_GAP_PX;

        const currentScrollTop = scrollableParent.scrollTop;
        const distance = targetTop - currentScrollTop;

        let behavior: ScrollBehavior;

        if (distance < 0) {
          behavior =
            Math.abs(distance) <
            MESSAGE_LIST_DATE_JUMP_SMOOTH_SCROLL_MAX_DISTANCE_UP_PX
              ? "smooth"
              : "auto";
        } else {
          behavior =
            distance < MESSAGE_LIST_DATE_JUMP_SMOOTH_SCROLL_MAX_DISTANCE_DOWN_PX
              ? "smooth"
              : "auto";
        }

        scrollableParent.scrollTo({
          top: targetTop,
          behavior,
        });
      }
    }
  }, []);

  const handleDateRef = useCallback(
    (dateKey: string, element: HTMLLIElement | null) => {
      if (element) {
        dateRefs.current.set(dateKey, element);
        return;
      }

      dateRefs.current.delete(dateKey);
    },
    []
  );

  const handleReadReceiptSlotClick = useCallback(
    (messageId: number) => {
      const senderUsername = senderUsernameByMessageId.get(messageId);
      const avatars = getReadReceiptAvatarsForMessage(
        readReceiptDisplayContext,
        messageId,
        senderUsername
      );
      const readers = resolveReadReceiptUsersFromUserList(avatars, userList);
      if (readers.length === 0) {
        return;
      }

      setReadReceiptModalReaders(readers);
    },
    [readReceiptDisplayContext, senderUsernameByMessageId, userList]
  );

  const handleCloseReadReceiptModal = useCallback(() => {
    setReadReceiptModalReaders(null);
  }, []);

  const handleReadReceiptMemberProfileClick = useCallback(
    async (user: User) => {
      setReadReceiptModalReaders(null);
      await openChatMemberProfile(user);
    },
    [openChatMemberProfile]
  );

  const handleSenderProfileClick = useCallback(
    (user: User) => {
      void openChatMemberProfile(user);
    },
    [openChatMemberProfile]
  );

  return (
    <>
      <ul
        className="flex flex-col list-none"
        style={{ gap: MESSAGE_LIST_GAP_PX }}
      >
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];

          return (
            <React.Fragment key={message.id}>
              {newMessagesDividerIndex === index ? <NewMessagesDivider /> : null}
              <MessageListItem
                message={message}
                prevMessage={prevMessage}
                nextMessage={nextMessage}
                currentUsername={currentUsername}
                isLatestMessageFromOpponent={isLatestMessageFromOpponent}
                isGroupChat={isGroup}
                readReceiptDisplayContext={readReceiptDisplayContext}
                userByUsername={userByUsername}
                userImageMap={userImageMap}
                userNameMap={userNameMap}
                onReadReceiptSlotClick={handleReadReceiptSlotClick}
                onSenderProfileClick={handleSenderProfileClick}
                onDateClick={handleDateClick}
                onDateRef={handleDateRef}
                onRetryFailedText={onRetryFailedText}
                onRetryFailedImage={onRetryFailedImage}
                onDeletePending={onDeletePending}
              />
            </React.Fragment>
          );
        })}
      </ul>
      <ReadReceiptReadersModal
        isOpen={readReceiptModalReaders !== null}
        readers={readReceiptModalReaders ?? []}
        currentUsername={currentUsername}
        onClose={handleCloseReadReceiptModal}
        onMemberProfileClick={handleReadReceiptMemberProfileClick}
      />
    </>
  );
};

export const MessageList = React.memo(MessageListComponent);
