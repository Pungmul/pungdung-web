import type { OtherParticipantReadSnapshot } from "./merge-other-participant-read-from-socket.service";
import type { UserLastReadMessageId } from "../types/chat-room.types";

type MergeOtherParticipantsReadSeedParams = {
  userInitReadList: readonly UserLastReadMessageId[];
  currentUserId: number | null;
};

function mergeSeedWithPrev(
  prevLastReadMessageId: number | null,
  seedLastReadMessageId: number | null
): number | null {
  if (seedLastReadMessageId === null) {
    return prevLastReadMessageId;
  }

  if (prevLastReadMessageId === null) {
    return seedLastReadMessageId;
  }

  return Math.max(prevLastReadMessageId, seedLastReadMessageId);
}

/**
 * room query의 userInitReadList seed를 "다른 참여자" 읽음 스냅샷에 병합한다.
 * 같은 유저에 대해서는 max 병합으로 소켓에서 앞선 진행을 덮어쓰지 않는다.
 */
export function mergeOtherParticipantsReadSeed(
  prev: OtherParticipantReadSnapshot,
  params: MergeOtherParticipantsReadSeedParams
): OtherParticipantReadSnapshot {
  const { userInitReadList, currentUserId } = params;

  let nextSnapshot = prev;

  for (const readState of userInitReadList) {
    if (readState.userId === currentUserId) {
      continue;
    }

    const prevLastReadMessageId = nextSnapshot[readState.userId] ?? null;
    const nextLastReadMessageId = mergeSeedWithPrev(
      prevLastReadMessageId,
      readState.lastReadMessageId
    );

    if (nextLastReadMessageId === prevLastReadMessageId) {
      continue;
    }

    if (nextSnapshot === prev) {
      nextSnapshot = { ...prev };
    }

    nextSnapshot[readState.userId] = nextLastReadMessageId;
  }

  return nextSnapshot;
}
