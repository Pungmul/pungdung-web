import { describe, expect, it } from "vitest";

import type { Message, PendingMessage } from "../types";

import { removePendingMessagesShadowedByConfirmed } from "./reconcile-pending-messages.service";

type PendingTextMessage = Extract<PendingMessage, { chatType: "TEXT" }>;
type ConfirmedTextMessage = Extract<Message, { chatType: "TEXT" }>;

const pendingText = (
  override: Partial<PendingTextMessage> = {}
): PendingTextMessage => ({
  id: "p1",
  senderUsername: "me",
  content: "hello",
  chatType: "TEXT",
  imageUrlList: null,
  chatRoomUUID: "room",
  createdAt: "2026-05-16 10:00:00",
  state: "pending",
  ...override,
});

const confirmedText = (
  override: Partial<ConfirmedTextMessage> = {}
): ConfirmedTextMessage => ({
  id: 1,
  senderUsername: "me",
  content: "hello",
  chatType: "TEXT",
  imageUrlList: null,
  chatRoomUUID: "room",
  createdAt: "2026-05-16T10:00:01.000Z",
  ...override,
});

describe("removePendingMessagesShadowedByConfirmed", () => {
  it("같은 sender/room/type/content의 confirmed가 있으면 pending을 렌더 대상에서 제외한다", () => {
    const pending = pendingText();
    const result = removePendingMessagesShadowedByConfirmed(
      [pending],
      [confirmedText()]
    );

    expect(result).toEqual([]);
  });

  it("failed pending은 confirmed와 내용이 같아도 유지한다", () => {
    const pending = pendingText({ state: "failed" });
    const result = removePendingMessagesShadowedByConfirmed(
      [pending],
      [confirmedText()]
    );

    expect(result).toEqual([pending]);
  });

  it("pending에 clientId가 있으면 content가 같아도 clientId 불일치 시 유지한다", () => {
    const pending = pendingText({ clientId: "pending-client-id" });
    const result = removePendingMessagesShadowedByConfirmed(
      [pending],
      [confirmedText({ clientId: "another-client-id" })]
    );
    expect(result).toEqual([pending]);
  });

  it("같은 content라도 다른 방 confirmed면 pending을 유지한다", () => {
    const pending = pendingText();
    const result = removePendingMessagesShadowedByConfirmed(
      [pending],
      [confirmedText({ chatRoomUUID: "other-room" })]
    );

    expect(result).toEqual([pending]);
  });

  it("같은 내용을 연속 전송한 경우 confirmed 한 건은 pending 한 건만 숨긴다", () => {
    const first = pendingText({ id: "p1" });
    const second = pendingText({ id: "p2" });
    const result = removePendingMessagesShadowedByConfirmed(
      [first, second],
      [confirmedText()]
    );

    expect(result).toEqual([second]);
  });
});
