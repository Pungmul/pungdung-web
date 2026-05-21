import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { chatQueries } from "../../../queries";
import * as resetUnreadIdbService from "../../../services/chat-room-list/reset-unread-count-in-room-list-indexed-db.service";
import type { ChatRoomListItem } from "../../../types";

import { applyResetRoomUnreadCount } from "./apply-reset-room-unread-count";

const createRoom = (
  overrides: Partial<ChatRoomListItem> = {}
): ChatRoomListItem => ({
  chatRoomUUID: "room-1",
  isMuted: false,
  lastMessageTime: null,
  lastMessageContent: null,
  unreadCount: 3,
  senderId: null,
  senderName: null,
  receiverId: null,
  receiverName: null,
  chatRoomMemberIds: [],
  chatRoomMemberNames: [],
  roomName: "room",
  profileImageUrl: null,
  group: false,
  ...overrides,
});

describe("applyResetRoomUnreadCount", () => {
  it("React Query room list와 IndexedDB unreadCount를 함께 0으로 맞춘다", async () => {
    const queryClient = new QueryClient();
    const listKey = chatQueries.roomList().queryKey;

    queryClient.setQueryData(listKey, [
      createRoom({ chatRoomUUID: "room-1", unreadCount: 4 }),
      createRoom({ chatRoomUUID: "room-2", unreadCount: 2 }),
    ]);

    const idbSpy = vi
      .spyOn(resetUnreadIdbService, "resetUnreadCountInRoomListIndexedDB")
      .mockResolvedValue(undefined);

    await applyResetRoomUnreadCount(queryClient, "room-1");

    const roomList = queryClient.getQueryData<ChatRoomListItem[]>(listKey);
    expect(
      roomList?.find((room) => room.chatRoomUUID === "room-1")?.unreadCount
    ).toBe(0);
    expect(
      roomList?.find((room) => room.chatRoomUUID === "room-2")?.unreadCount
    ).toBe(2);
    expect(idbSpy).toHaveBeenCalledWith("room-1");
  });

  it("room list 캐시가 없어도 IndexedDB reset은 시도한다", async () => {
    const queryClient = new QueryClient();
    const idbSpy = vi
      .spyOn(resetUnreadIdbService, "resetUnreadCountInRoomListIndexedDB")
      .mockResolvedValue(undefined);

    await applyResetRoomUnreadCount(queryClient, "room-1");

    expect(idbSpy).toHaveBeenCalledWith("room-1");
  });

  it("목록에 없는 방이면 room list를 invalidate 한다", async () => {
    const queryClient = new QueryClient();
    const listKey = chatQueries.roomList().queryKey;
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    queryClient.setQueryData(listKey, [
      createRoom({ chatRoomUUID: "room-2", unreadCount: 1 }),
    ]);

    vi.spyOn(
      resetUnreadIdbService,
      "resetUnreadCountInRoomListIndexedDB"
    ).mockResolvedValue(undefined);

    await applyResetRoomUnreadCount(queryClient, "room-1");

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: listKey });
  });

  it("이미 unreadCount가 0이면 setQueryData를 변경하지 않는다", async () => {
    const queryClient = new QueryClient();
    const listKey = chatQueries.roomList().queryKey;
    const rooms = [createRoom({ chatRoomUUID: "room-1", unreadCount: 0 })];
    queryClient.setQueryData(listKey, rooms);

    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");
    vi.spyOn(
      resetUnreadIdbService,
      "resetUnreadCountInRoomListIndexedDB"
    ).mockResolvedValue(undefined);

    await applyResetRoomUnreadCount(queryClient, "room-1");

    expect(setQueryDataSpy).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(listKey)).toEqual(rooms);
  });
});
