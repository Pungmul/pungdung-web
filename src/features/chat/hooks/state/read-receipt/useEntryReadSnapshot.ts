"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type { EntryReadSignCoordRef } from "./entry-read-sign-coord";
import { markEntrySnapshotCaptured } from "./entry-read-sign-coord";
import { computeHadUnreadOnEntry } from "../../../services";
import { resolveLatestNumericMessageIdFromList } from "../../../services";
import { resolveOwnLastReadMessageIdFromChatRoom } from "../../../services";
import type { Message, PendingMessage } from "../../../types";
import type { ChatRoom } from "../../../types/chat-room.types";

export type EntryReadSnapshot = {
  entryLastReadMessageId: number | null;
  hadUnreadOnEntry: boolean;
  isEntrySnapshotCaptured: boolean;
};

const EMPTY_SNAPSHOT: EntryReadSnapshot = {
  entryLastReadMessageId: null,
  hadUnreadOnEntry: false,
  isEntrySnapshotCaptured: false,
};

/**
 * roomId 단위로 읽음 위치와 미확인 여부를 1회 고정한다.
 * room query refetch가 끝난 뒤 스냅샷해 readSign이 오염시킨 캐시를 피한다.
 */
export function useEntryReadSnapshot(
  roomId: string,
  chatRoomData: ChatRoom | undefined,
  currentUsername: string | undefined,
  messages: readonly (Message | PendingMessage)[],
  isRoomInfoReadyForEntrySnapshot: boolean,
  coordRef?: EntryReadSignCoordRef,
  entryUnreadCountHint = 0
): EntryReadSnapshot {
  const snapshotRef = useRef<{
    roomId: string;
    entryLastReadMessageId: number | null;
    hadUnreadOnEntry: boolean;
  } | null>(null);
  const [isEntrySnapshotCaptured, setIsEntrySnapshotCaptured] = useState(false);

  useLayoutEffect(() => {
    snapshotRef.current = null;
    setIsEntrySnapshotCaptured(false);
  }, [roomId]);

  useLayoutEffect(() => {
    const canCaptureSnapshot =
      isRoomInfoReadyForEntrySnapshot &&
      chatRoomData &&
      currentUsername &&
      messages.length > 0 &&
      chatRoomData.chatRoomInfo.chatRoomUUID === roomId;

    if (!canCaptureSnapshot) {
      return;
    }

    const alreadyCapturedThisRoom = snapshotRef.current?.roomId === roomId;

    if (alreadyCapturedThisRoom) {
      setIsEntrySnapshotCaptured(true);
      return;
    }

    const entryLastReadMessageId = resolveOwnLastReadMessageIdFromChatRoom(
      chatRoomData,
      currentUsername
    );
    const latestMessageIdAtEntry =
      resolveLatestNumericMessageIdFromList(messages);

    snapshotRef.current = {
      roomId,
      entryLastReadMessageId,
      hadUnreadOnEntry: computeHadUnreadOnEntry(
        entryLastReadMessageId,
        latestMessageIdAtEntry,
        { entryUnreadCountHint }
      ),
    };
    if (coordRef) {
      markEntrySnapshotCaptured(coordRef, roomId);
    }
    setIsEntrySnapshotCaptured(true);
  }, [
    roomId,
    isRoomInfoReadyForEntrySnapshot,
    chatRoomData,
    currentUsername,
    messages,
    coordRef,
    entryUnreadCountHint,
  ]);

  const snapshot = snapshotRef.current;
  const isSnapshotForCurrentRoom = snapshot?.roomId === roomId;

  if (!isEntrySnapshotCaptured || !snapshot || !isSnapshotForCurrentRoom) {
    return EMPTY_SNAPSHOT;
  }

  return {
    entryLastReadMessageId: snapshot.entryLastReadMessageId,
    hadUnreadOnEntry: snapshot.hadUnreadOnEntry,
    isEntrySnapshotCaptured: true,
  };
}
