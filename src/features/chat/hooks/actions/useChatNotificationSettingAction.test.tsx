import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as chatApi from "../../api";
import * as chatLib from "../../lib";
import { chatQueries } from "../../queries";
import type { ChatRoomListItem } from "../../types";

import { useChatNotificationSettingAction } from "./useChatNotificationSettingAction";

function createRoom(overrides: Partial<ChatRoomListItem> = {}): ChatRoomListItem {
  return {
    chatRoomUUID: "room-1",
    isMuted: false,
    lastMessageTime: null,
    lastMessageContent: null,
    unreadCount: null,
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
  };
}

describe("useChatNotificationSettingAction", () => {
  beforeEach(() => {
    vi.spyOn(chatApi, "updateChatRoomNotificationMuted").mockResolvedValue(undefined);
    vi.spyOn(chatLib, "getChatRoomListCache").mockResolvedValue({
      key: "chat-room-list",
      rooms: [createRoom()],
      updatedAt: 1700000000000,
      validatedAt: 1700000000500,
    });
    vi.spyOn(chatLib, "setChatRoomListCache").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updateRoomNotification 성공 시 roomList 캐시와 indexedDB를 갱신하고 대상 roomNotification만 invalidate 한다", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const targetRoomId = "room-1";
    const roomListKey = chatQueries.roomList().queryKey;
    const targetRoomNotificationKey = chatQueries.roomNotification(targetRoomId).queryKey;

    queryClient.setQueryData(roomListKey, [
      createRoom({ chatRoomUUID: targetRoomId, isMuted: false }),
      createRoom({ chatRoomUUID: "room-2", isMuted: true }),
    ]);

    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useChatNotificationSettingAction(), { wrapper });

    await act(async () => {
      await result.current.updateRoomNotification(targetRoomId, true);
    });

    await waitFor(() => {
      const cached = queryClient.getQueryData<ChatRoomListItem[]>(roomListKey);
      expect(cached?.find((room) => room.chatRoomUUID === targetRoomId)?.isMuted).toBe(true);
      expect(cached?.find((room) => room.chatRoomUUID === "room-2")?.isMuted).toBe(true);
    });

    expect(chatApi.updateChatRoomNotificationMuted).toHaveBeenCalledWith(targetRoomId, {
      muted: true,
    });

    expect(chatLib.setChatRoomListCache).toHaveBeenCalledWith({
      key: "chat-room-list",
      rooms: [createRoom({ chatRoomUUID: targetRoomId, isMuted: true })],
      updatedAt: 1700000000000,
      validatedAt: 1700000000500,
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: targetRoomNotificationKey });
    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith({ queryKey: roomListKey });
  });
});
