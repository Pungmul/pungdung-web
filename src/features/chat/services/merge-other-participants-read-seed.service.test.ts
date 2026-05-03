import { describe, expect, it } from "vitest";

import type { UserLastReadMessageId } from "../types";
import type { OtherParticipantReadSnapshot } from "./merge-other-participant-read-from-socket.service";
import { mergeOtherParticipantsReadSeed } from "./merge-other-participants-read-seed.service";

describe("mergeOtherParticipantsReadSeed", () => {
  it("내 userId는 seed 병합에서 제외한다", () => {
    const prev: OtherParticipantReadSnapshot = {};
    const seed: UserLastReadMessageId[] = [
      { userId: 10, lastReadMessageId: 100 },
      { userId: 20, lastReadMessageId: 200 },
    ];

    const next = mergeOtherParticipantsReadSeed(prev, {
      userInitReadList: seed,
      currentUserId: 10,
    });

    expect(next).toEqual({ 20: 200 });
  });

  it("재시드 시 max 병합으로 소켓 진행을 유지한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 300 };
    const seed: UserLastReadMessageId[] = [
      { userId: 20, lastReadMessageId: 250 },
    ];

    const next = mergeOtherParticipantsReadSeed(prev, {
      userInitReadList: seed,
      currentUserId: 10,
    });

    expect(next).toBe(prev);
  });
});
