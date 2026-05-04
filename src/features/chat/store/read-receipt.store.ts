import { create } from "zustand";

import {
  mergeOtherParticipantReadFromSocket,
  type OtherParticipantReadSnapshot,
} from "../services/merge-other-participant-read-from-socket.service";
import { mergeOtherParticipantsReadSeed } from "../services/merge-other-participants-read-seed.service";
import type { UserLastReadMessageId } from "../types";

export const EMPTY_OTHER_PARTICIPANT_READ_SNAPSHOT: OtherParticipantReadSnapshot =
  Object.freeze({});

type ReadReceiptState = {
  byRoomId: Record<string, OtherParticipantReadSnapshot>;
  resetRoomSlice: (roomId: string) => void;
  applySocketRead: (
    roomId: string,
    userId: number,
    messageIds: readonly number[]
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
  applySocketRead: (roomId, userId, messageIds) => {
    set((state) => {
      const prevRoomSnapshot =
        state.byRoomId[roomId] ?? EMPTY_OTHER_PARTICIPANT_READ_SNAPSHOT;
      const nextRoomSnapshot = mergeOtherParticipantReadFromSocket(
        prevRoomSnapshot,
        {
          userId,
          messageIds,
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
