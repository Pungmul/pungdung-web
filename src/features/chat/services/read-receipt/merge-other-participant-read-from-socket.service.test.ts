import { describe, expect, it } from "vitest";

import {
  mergeOtherParticipantReadFromSocket,
  type OtherParticipantReadSnapshot,
} from "./merge-other-participant-read-from-socket.service";

describe("mergeOtherParticipantReadFromSocket", () => {
  it("messageIds가 비어 있으면 기존 스냅샷을 그대로 유지한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 30 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 20,
      messageIds: [],
    });

    expect(next).toBe(prev);
  });

  it("해당 유저의 lastRead를 max 병합한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 30 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 20,
      messageIds: [25, 45, 10],
    });

    expect(next).toEqual({ 20: 45 });
  });

  it("역순 이벤트는 기존 값을 유지한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 50 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 20,
      messageIds: [30],
    });

    expect(next).toBe(prev);
  });
});
