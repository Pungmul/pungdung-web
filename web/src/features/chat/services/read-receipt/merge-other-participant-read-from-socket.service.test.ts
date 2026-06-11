import { describe, expect, it } from "vitest";

import {
  mergeOtherParticipantReadFromSocket,
  type OtherParticipantReadSnapshot,
} from "./merge-other-participant-read-from-socket.service";

const timelineMessages = [
  { id: 1590, createdAt: "2026-06-12T19:00:00.000Z" },
  { id: 1593, createdAt: "2026-06-12T19:04:00.000Z" },
];

describe("mergeOtherParticipantReadFromSocket", () => {
  it("messageIds·readAt가 모두 없으면 기존 스냅샷을 유지한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 30 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 20,
      messageIds: [],
      readAt: "2026-06-12T19:04:12.508Z",
    });

    expect(next).toBe(prev);
  });

  it("messageIds가 비어 있어도 readAt+타임라인이 있으면 병합한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 30 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 20,
      messageIds: [],
      readAt: "2026-06-12T19:04:12.508783911",
      timelineMessages,
    });

    expect(next).toEqual({ 20: 1593 });
  });

  it("messageLogId 오염 prev가 있어도 확정 messageIds로 복구한다", () => {
    const prev: OtherParticipantReadSnapshot = { 2: 7161 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 2,
      messageIds: [1593],
      readAt: "2026-06-12T19:04:12.508783911",
      timelineMessages,
    });

    expect(next).toEqual({ 2: 1593 });
  });

  it("해당 유저의 lastRead를 max 병합한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 30 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 20,
      messageIds: [25, 45, 10],
      timelineMessages,
    });

    expect(next).toEqual({ 20: 45 });
  });

  it("역순 이벤트는 기존 값을 유지한다", () => {
    const prev: OtherParticipantReadSnapshot = { 20: 50 };
    const next = mergeOtherParticipantReadFromSocket(prev, {
      userId: 20,
      messageIds: [30],
      timelineMessages,
    });

    expect(next).toBe(prev);
  });
});
