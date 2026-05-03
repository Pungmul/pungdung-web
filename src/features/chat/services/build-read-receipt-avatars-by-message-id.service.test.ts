import { describe, expect, it } from "vitest";

import type { User } from "@/features/user";

import { buildReadReceiptAvatarsByMessageId } from "./build-read-receipt-avatars-by-message-id.service";
import { buildReadReceiptDisplayContext } from "./build-read-receipt-display-context.service";
import { getReadReceiptAvatarsForMessage } from "./get-read-receipt-avatars-for-message.service";
import { shouldShowDirectReadLabel } from "./should-show-direct-read-label.service";

const user = (
  userId: number,
  username: string,
  name = `user-${userId}`
): User => ({
  userId,
  username,
  name,
  profileImage: {
    id: userId,
    originalFilename: "a.jpg",
    convertedFileName: "a.jpg",
    fullFilePath: `https://example.com/${userId}.jpg`,
    fileType: "image/jpeg",
    fileSize: 1,
    createdAt: "2026-01-01",
  },
});

describe("buildReadReceiptAvatarsByMessageId", () => {
  it("lastReadMessageId와 같은 메시지 id에만 참여자 아바타를 붙인다", () => {
    const result = buildReadReceiptAvatarsByMessageId({
      userInitReadList: [
        { userId: 1, lastReadMessageId: 3 },
        { userId: 2, lastReadMessageId: 2 },
        { userId: 3, lastReadMessageId: 1 },
      ],
      userList: [user(1, "me"), user(2, "u2"), user(3, "u3")],
      currentUserId: 1,
      isGroup: true,
    });

    expect(result.get(1)?.map((avatar) => avatar.userId)).toEqual([3]);
    expect(result.get(2)?.map((avatar) => avatar.userId)).toEqual([2]);
    expect(result.get(3)).toBeUndefined();
  });

  it("같은 lastReadMessageId를 가진 참여자는 한 메시지 아래에 모인다", () => {
    const result = buildReadReceiptAvatarsByMessageId({
      userInitReadList: [
        { userId: 2, lastReadMessageId: 5 },
        { userId: 3, lastReadMessageId: 5 },
      ],
      userList: [user(1, "me"), user(2, "u2"), user(3, "u3")],
      currentUserId: 1,
      isGroup: true,
    });

    expect(result.get(5)?.map((avatar) => avatar.userId)).toEqual([2, 3]);
  });

  it("lastReadMessageId가 null이면 제외한다", () => {
    const result = buildReadReceiptAvatarsByMessageId({
      userInitReadList: [{ userId: 2, lastReadMessageId: null }],
      userList: [user(1, "me"), user(2, "u2")],
      currentUserId: 1,
      isGroup: true,
    });

    expect(result.size).toBe(0);
  });
});

describe("buildReadReceiptDisplayContext / getReadReceiptAvatarsForMessage", () => {
  it("1:1 채팅에서는 상대 lastReadMessageId와 일치하는 내 메시지에만 읽음 라벨을 붙인다", () => {
    const context = buildReadReceiptDisplayContext({
      userInitReadList: [
        { userId: 1, lastReadMessageId: 3 },
        { userId: 2, lastReadMessageId: 2 },
      ],
      userList: [user(1, "me"), user(2, "u2")],
      currentUserId: 1,
      isGroup: false,
    });

    expect(context.mode).toBe("direct");
    expect(
      shouldShowDirectReadLabel({
        context,
        messageId: 1,
        isMyMessage: true,
        isLatestMessageFromOpponent: false,
      })
    ).toBe(false);
    expect(
      shouldShowDirectReadLabel({
        context,
        messageId: 2,
        isMyMessage: true,
        isLatestMessageFromOpponent: false,
      })
    ).toBe(true);
    expect(
      shouldShowDirectReadLabel({
        context,
        messageId: 3,
        isMyMessage: false,
        isLatestMessageFromOpponent: false,
      })
    ).toBe(false);
    expect(getReadReceiptAvatarsForMessage(context, 1)).toHaveLength(0);
    expect(getReadReceiptAvatarsForMessage(context, 2)).toHaveLength(0);
  });

  it("1:1 채팅에서 마지막 메시지가 상대 메시지면 읽음 라벨을 숨긴다", () => {
    const context = buildReadReceiptDisplayContext({
      userInitReadList: [
        { userId: 1, lastReadMessageId: 3 },
        { userId: 2, lastReadMessageId: 2 },
      ],
      userList: [user(1, "me"), user(2, "u2")],
      currentUserId: 1,
      isGroup: false,
    });

    expect(
      shouldShowDirectReadLabel({
        context,
        messageId: 2,
        isMyMessage: true,
        isLatestMessageFromOpponent: true,
      })
    ).toBe(false);
  });

  it("인원이 2명이어도 group이 true이면 그룹 규칙을 적용한다", () => {
    const context = buildReadReceiptDisplayContext({
      userInitReadList: [
        { userId: 1, lastReadMessageId: 3 },
        { userId: 2, lastReadMessageId: 2 },
      ],
      userList: [user(1, "me"), user(2, "u2")],
      currentUserId: 1,
      isGroup: true,
    });

    expect(context.mode).toBe("group");
    expect(getReadReceiptAvatarsForMessage(context, 2, "u2")).toHaveLength(0);
    expect(getReadReceiptAvatarsForMessage(context, 2, "me")).toHaveLength(1);
  });

  it("3인 이상 채팅에서는 그룹 경계 규칙을 유지한다", () => {
    const context = buildReadReceiptDisplayContext({
      userInitReadList: [
        { userId: 1, lastReadMessageId: 3 },
        { userId: 2, lastReadMessageId: 2 },
        { userId: 3, lastReadMessageId: 1 },
      ],
      userList: [user(1, "me"), user(2, "u2"), user(3, "u3")],
      currentUserId: 1,
      isGroup: true,
    });

    expect(context.mode).toBe("group");
    expect(getReadReceiptAvatarsForMessage(context, 1, "me")).toHaveLength(1);
    expect(getReadReceiptAvatarsForMessage(context, 1, "u3")).toHaveLength(0);
    expect(getReadReceiptAvatarsForMessage(context, 2, "u2")).toHaveLength(0);
    expect(getReadReceiptAvatarsForMessage(context, 2, "me")).toHaveLength(1);
    expect(getReadReceiptAvatarsForMessage(context, 3)).toHaveLength(0);
  });
});
