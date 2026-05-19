import { create } from "zustand";

import {
  mergeOtherParticipantReadFromSocket,
  type OtherParticipantReadSnapshot,
} from "../services";
import { mergeOtherParticipantsReadSeed } from "../services";
import { resolveLastReadMessageIdFromReadBroadcast } from "../services";

import { logReadSignDebug } from "../lib/read-receipt/read-sign-debug-log";
import type { ReadAtResolutionMessage } from "../services";
import type { UserLastReadMessageId } from "../types";

export const EMPTY_OTHER_PARTICIPANT_READ_SNAPSHOT: OtherParticipantReadSnapshot =
  Object.freeze({});

export type ApplySocketReadParams = {
  messageIds: readonly number[];
  readAt: string;
  timelineMessages?: readonly ReadAtResolutionMessage[] | undefined;
};

type ReadReceiptState = {
  byRoomId: Record<string, OtherParticipantReadSnapshot>;
  resetRoomSlice: (roomId: string) => void;
  applySocketRead: (
    roomId: string,
    userId: number,
    params: ApplySocketReadParams
  ) => void;
  mergeSeed: (
    roomId: string,
    userInitReadList: readonly UserLastReadMessageId[],
    currentUserId: number | null
  ) => void;
};

export const useReadReceiptStore = create<ReadReceiptState>()((set) => ({
  byRoomId: {},
  resetRoomSlice: (roomId) => {
    set((state) => {
      if (state.byRoomId[roomId] === undefined) {
        return state;
      }

      const nextByRoomId = Object.fromEntries(
        Object.entries(state.byRoomId).filter(([key]) => key !== roomId)
      );

      return {
        ...state,
        byRoomId: nextByRoomId,
      };
    });
  },
  applySocketRead: (roomId, userId, params) => {
    const { messageIds, readAt, timelineMessages } = params;

    set((state) => {
      const prevRoomSnapshot =
        state.byRoomId[roomId] ?? EMPTY_OTHER_PARTICIPANT_READ_SNAPSHOT;
      const prevLastReadMessageId = prevRoomSnapshot[userId] ?? null;
      const resolvedLastReadMessageId = resolveLastReadMessageIdFromReadBroadcast(
        {
          messageIds,
          readAt,
          timelineMessages,
        }
      );
      const nextRoomSnapshot = mergeOtherParticipantReadFromSocket(
        prevRoomSnapshot,
        {
          userId,
          messageIds,
          readAt,
          timelineMessages,
          resolvedLastReadMessageId,
        }
      );
      const nextLastReadMessageId = nextRoomSnapshot[userId] ?? null;

      if (nextRoomSnapshot === prevRoomSnapshot) {
        logReadSignDebug("store.applySocketRead.skipped", {
          roomId,
          userId,
          messageIds,
          readAt,
          resolvedLastReadMessageId,
          prevLastReadMessageId,
          reason:
            resolvedLastReadMessageId === null
              ? "no_resolved_last_read"
              : "no_snapshot_change",
        });
        return state;
      }

      logReadSignDebug("store.applySocketRead.applied", {
        roomId,
        userId,
        messageIds,
        readAt,
        resolvedLastReadMessageId,
        prevLastReadMessageId,
        nextLastReadMessageId,
      });

      return {
        ...state,
        byRoomId: {
          ...state.byRoomId,
          [roomId]: nextRoomSnapshot,
        },
      };
    });
  },
  mergeSeed: (roomId, userInitReadList, currentUserId) => {
    set((state) => {
      const prevRoomSnapshot =
        state.byRoomId[roomId] ?? EMPTY_OTHER_PARTICIPANT_READ_SNAPSHOT;
      const nextRoomSnapshot = mergeOtherParticipantsReadSeed(
        prevRoomSnapshot,
        {
          userInitReadList,
          currentUserId,
        }
      );

      if (nextRoomSnapshot === prevRoomSnapshot) {
        return state;
      }

      return {
        ...state,
        byRoomId: {
          ...state.byRoomId,
          [roomId]: nextRoomSnapshot,
        },
      };
    });
  },
}));
