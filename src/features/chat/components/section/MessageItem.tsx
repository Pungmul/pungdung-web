"use client";
import React from "react";

import dayjs from "dayjs";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

import DateItem from "./DateItem";
import type { Message, PendingMessage } from "../../types";
import { ChatMessage } from "../ui/ChatMessage";
import { ImageMessage } from "../ui/ImageMessage";

function isPendingMessage(m: Message | PendingMessage): m is PendingMessage {
  return "state" in m;
}

interface MessageItemProps {
  message: Message | PendingMessage;
  prevMessage: (Message | PendingMessage) | undefined;
  nextMessage: (Message | PendingMessage) | undefined;
  currentUserId: string;
  unreadCount: number;
  userImageUrl: string | null;
  senderDisplayName: string;
  onDateClick: (dateKey: string) => void;
  dateRef: ((el: HTMLLIElement | null) => void) | undefined;
  onResendText: (message: string) => void;
  onResendImage: (files: FileList) => void;
  onDeletePending: (message: PendingMessage) => void;
}

const TimeFormat = (time: Date): string => {
  const Hours = time.getHours();
  const Minutes = time.getMinutes();

  if (Hours === 0) return "오전 12:00";
  if (Hours < 12)
    return `오전 ${Hours.toString().padStart(
      2,
      "0"
    )}:${Minutes.toString().padStart(2, "0")}`;
  if (Hours === 12) return `오후 12:00`;
  return `오후 ${(Hours - 12)
    .toString()
    .padStart(2, "0")}:${Minutes.toString().padStart(2, "0")}`;
};

const MessageItemComponent: React.FC<MessageItemProps> = ({
  message: _message,
  prevMessage: _prevMessage,
  nextMessage: _nextMessage,
  currentUserId,
  unreadCount,
  userImageUrl,
  senderDisplayName,
  onDateClick,
  dateRef,
  onResendText,
  onResendImage,
  onDeletePending,
}) => {
  const isUser = _message.senderUsername === currentUserId;
  const timeStamp = TimeFormat(new Date(_message.createdAt));

  const isSameTimeBefore =
    _prevMessage &&
    _message.senderUsername === _prevMessage.senderUsername &&
    TimeFormat(new Date(_message.createdAt)) ===
    TimeFormat(new Date(_prevMessage?.createdAt));

  const isSameTimeAfter =
    _nextMessage &&
    _message.senderUsername === _nextMessage.senderUsername &&
    TimeFormat(new Date(_message.createdAt)) ===
    TimeFormat(new Date(_nextMessage?.createdAt));

  const isSameDate =
    _prevMessage &&
    dayjs(_message.createdAt).format("YYYY.MM.DD ddd") ===
    dayjs(_prevMessage.createdAt).format("YYYY.MM.DD ddd");

  const dateKey = dayjs(_message.createdAt).format("YYYY-MM-DD");

  // sideContent를 컴포넌트로 분리하여 메모이제이션
  const sideContent = (
    <div className="flex flex-col gap-[2px] shrink-0 min-w-fit">
      <div
        className={
          "text-[#DDD] text-[10px] lg:text-[11px]" +
          (isUser ? " self-start" : " self-end")
        }
      >
        {unreadCount > 0 ? unreadCount : ""}
      </div>
      {!isSameTimeAfter && (
        <div
          className={
            "text-[#DDD] text-[10px] lg:text-[11px]" +
            (isUser ? " self-start" : " self-end")
          }
        >
          {timeStamp}
        </div>
      )}
    </div>
  );

  if (_message.chatType === "TEXT") {
    if (isPendingMessage(_message)) {
      const pendingSide =
        _message.state === "pending" ? (
          <div className="text-grey-300 text-[11px] lg:text-[12px]">전송중</div>
        ) : (
          <div className="flex flex-row gap-2">
            <PaperAirplaneIcon
              className="w-4 h-4  "
              color="#ff6767"
              width={16}
              height={16}
              onClick={() => {
                onResendText(_message.content);
              }}
              style={{ cursor: "pointer" }}
            />
            <XMarkIcon
              className="w-4 h-4  "
              color="#ff6767"
              width={16}
              height={16}
              onClick={() => {
                onDeletePending(_message);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      return (
        <React.Fragment key={_message.id}>
          {!isSameDate && (
            <DateItem
              key={_message.id + "date"}
              date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
              onClick={() => onDateClick(dateKey)}
            />
          )}
          <li className="flex flex-col gap-2" key={_message.id} ref={dateRef}>
            <ChatMessage
              key={_message.id}
              message={_message.content}
              sideContent={pendingSide}
              isUser={true}
              userImageUrl={null}
              senderUsername={""}
              isProfileRevealed={!isSameTimeBefore}
            />
          </li>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={_message.id}>
        {!isSameDate && (
          <DateItem
            key={_message.id + "date"}
            date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
            onClick={() => onDateClick(dateKey)}
          />
        )}
        <li className="flex flex-col gap-2" key={_message.id} ref={dateRef}>
          <ChatMessage
            key={_message.id}
            message={_message.content}
            sideContent={_message.createdAt && sideContent}
            isUser={isUser}
            userImageUrl={userImageUrl}
            senderUsername={senderDisplayName}
            isProfileRevealed={!isSameTimeBefore}
          />
        </li>
      </React.Fragment>
    );
  } else if (_message.chatType === "IMAGE") {
    if (isPendingMessage(_message)) {
      const pendingSide =
        _message.state === "pending" ? (
          <div className="flex flex-row gap-2">
            <PaperAirplaneIcon
              className="w-4 h-4  "
              width={16}
              height={16}
              color="#ff6767"
            />
            <div className="text-grey-300 text-[11px] lg:text-[12px]">
              전송중
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-2">
            <PaperAirplaneIcon
              className="w-4 h-4  "
              width={16}
              height={16}
              color="#ff6767"
              onClick={() => {
                onResendImage(
                  _message.imageUrlList.map(
                    (url) => new File([], url),
                  ) as unknown as FileList,
                );
              }}
              style={{ cursor: "pointer" }}
            />
            <XMarkIcon
              className="w-4 h-4  "
              width={16}
              height={16}
              color="#ff6767"
              onClick={() => {
                onDeletePending(_message);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      return (
        <React.Fragment key={_message.id}>
          {!isSameDate && (
            <DateItem
              key={_message.id + "date"}
              date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
              onClick={() => onDateClick(dateKey)}
            />
          )}
          <li key={_message.id} ref={dateRef}>
            <ImageMessage
              imageList={_message.imageUrlList || []}
              sideContent={pendingSide}
              isUser={true}
              userImageUrl={null}
              senderUsername={""}
              isProfileRevealed={false}
            />
          </li>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={_message.id}>
        {!isSameDate && (
          <DateItem
            key={_message.id + "date"}
            date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
            onClick={() => onDateClick(dateKey)}
          />
        )}
        <li key={_message.id} ref={dateRef}>
          <ImageMessage
            imageList={_message.imageUrlList || []}
            sideContent={_message.createdAt && sideContent}
            isUser={isUser}
            userImageUrl={userImageUrl}
            senderUsername={senderDisplayName}
            isProfileRevealed={!isSameTimeBefore}
          />
        </li>
      </React.Fragment>
    );
  } else if (_message.chatType === "JOIN") {
    return (
      <React.Fragment key={_message.id}>
        {!isSameDate && (
          <DateItem
            key={_message.id + "date"}
            date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
            onClick={() => onDateClick(dateKey)}
          />
        )}
        <li key={_message.id}>
          <LogMessage>
            {`${senderDisplayName}님이 ${_message.content
              .split("님")[0]!
              .trim()}님을 초대했습니다.`}
          </LogMessage>
        </li>
      </React.Fragment>
    );
  } else if (_message.chatType === "LEAVE") {
    return (
      <React.Fragment key={_message.id}>
        {!isSameDate && (
          <DateItem
            key={_message.id + "date"}
            date={dayjs(_message.createdAt).format("YYYY.MM.DD ddd")}
            onClick={() => onDateClick(dateKey)}
          />
        )}
        <li key={_message.id}>
          <LogMessage>{`${_message.content}`}</LogMessage>
        </li>
      </React.Fragment>
    );
  }

  return null;
};

const LogMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-row justify-center items-end">
      <div className="text-grey-500 bg-grey-100 px-2 py-1 h-full flex items-center rounded-md text-xs lg:text-sm">
        {children}
      </div>
    </div>
  );
};

// 커스텀 비교 함수로 정밀한 메모이제이션
export const MessageItem = React.memo(MessageItemComponent, (prev, next) => {
  const prevState = "state" in prev.message ? prev.message.state : undefined;
  const nextState = "state" in next.message ? next.message.state : undefined;
  return (
    prev.message.id === next.message.id &&
    prevState === nextState &&
    prev.unreadCount === next.unreadCount &&
    prev.userImageUrl === next.userImageUrl &&
    prev.senderDisplayName === next.senderDisplayName &&
    prev.currentUserId === next.currentUserId &&
    prev.prevMessage?.id === next.prevMessage?.id &&
    prev.nextMessage?.id === next.nextMessage?.id &&
    prev.prevMessage?.createdAt === next.prevMessage?.createdAt &&
    prev.nextMessage?.createdAt === next.nextMessage?.createdAt
  );
});
